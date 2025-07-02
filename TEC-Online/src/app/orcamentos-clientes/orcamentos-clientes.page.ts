import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { CommonModule } from '@angular/common';
import { 
  IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle, IonContent, 
  IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent, 
  IonList, IonItemGroup, IonItemDivider, IonLabel, IonItem, IonSpinner,
  AlertController
} from '@ionic/angular/standalone';
import { catchError, finalize, tap } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-orcamentos-clientes',
  templateUrl: './orcamentos-clientes.page.html',
  styleUrls: ['./orcamentos-clientes.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle, IonContent,
    IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent,
    IonList, IonItemGroup, IonItemDivider, IonLabel, IonItem, IonSpinner
  ]
})
export class OrcamentosClientesPage implements OnInit {
  cliente: any = null;
  servicos: any[] = [];
  isLoading = true;
  errorMessage: string | null = null;
  debugInfo: any = {}; // Para análise de problemas

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router,
    private alertController: AlertController
  ) { }

  ngOnInit() {
    const clienteId = this.route.snapshot.paramMap.get('id');
    this.debugInfo.clienteId = clienteId;
    this.debugInfo.apiUrl = environment.api_url;

    if (clienteId && this.isValidId(clienteId)) {
      this.carregarDadosCliente(clienteId);
    } else {
      this.handleError('ID do cliente inválido ou não fornecido');
      this.logDebugInfo();
    }
  }

  private isValidId(id: string): boolean {
    return /^[0-9a-fA-F]{24}$/.test(id); // Valida ObjectId do MongoDB
  }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    this.debugInfo.tokenPresent = !!token;
    
    if (!token) {
      this.handleError('Autenticação necessária - Token não encontrado');
      this.redirectToLogin();
      throw new Error('Token não disponível');
    }
    
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  private async showAlert(message: string) {
    const alert = await this.alertController.create({
      header: 'Erro',
      message,
      buttons: ['OK']
    });
    await alert.present();
  }

  private redirectToLogin() {
    this.router.navigate(['/login'], {
      queryParams: { returnUrl: this.router.url }
    });
  }

  private handleError(message: string, error?: any): void {
    console.error(message, error);
    this.errorMessage = message;
    this.isLoading = false;
    this.debugInfo.lastError = { message, error };
    this.logDebugInfo();
    this.showAlert(message);
  }

  private logDebugInfo() {
    console.log('Debug Info:', this.debugInfo);
  }

  carregarDadosCliente(clienteId: string): void {
    this.isLoading = true;
    this.errorMessage = null;
    const headers = this.getAuthHeaders();

    // Verificação adicional da API
    this.testApiConnectivity().then(() => {
      this.http.get(`${environment.api_url}/clientes/${clienteId}`, { headers }).pipe(
        tap(response => {
          this.debugInfo.apiResponse = response;
          if (!response) {
            throw new Error('Resposta vazia da API');
          }
        }),
        catchError((error: HttpErrorResponse) => {
          this.debugInfo.apiError = {
            status: error.status,
            message: error.message,
            url: error.url,
            headers: error.headers
          };
          
          if (error.status === 404) {
            throw new Error('Cliente não encontrado na base de dados');
          } else if (error.status === 401) {
            this.redirectToLogin();
            throw new Error('Autenticação necessária');
          } else {
            throw new Error(`Erro na API: ${error.statusText}`);
          }
        }),
        finalize(() => this.logDebugInfo())
      ).subscribe({
        next: (cliente: any) => {
          this.cliente = cliente;
          this.carregarServicos(clienteId);
        },
        error: (err) => this.handleError(err.message, err)
      });
    });
  }

  private async testApiConnectivity() {
    try {
      const testUrl = `${environment.api_url}/health`;
      const response = await this.http.get(testUrl).toPromise();
      this.debugInfo.apiHealth = response;
    } catch (error) {
      this.debugInfo.apiHealthError = error;
      throw new Error('Falha na conexão com a API');
    }
  }

  carregarServicos(clienteId: string): void {
    const headers = this.getAuthHeaders();

    this.http.get(`${environment.api_url}/servicos?clienteId=${clienteId}`, { headers }).pipe(
      catchError((error: HttpErrorResponse) => {
        this.debugInfo.servicosError = {
          status: error.status,
          message: error.message,
          url: error.url
        };
        return of([]);
      }),
      finalize(() => {
        this.isLoading = false;
        this.logDebugInfo();
      })
    ).subscribe({
      next: (servicos: any) => this.servicos = servicos,
      error: (err) => this.handleError('Erro ao carregar serviços', err)
    });
  }

  formatCurrency(value: number): string {
    return value?.toLocaleString('pt-PT', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }) || '€0.00';
  }
}