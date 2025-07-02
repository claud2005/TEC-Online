import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { CommonModule } from '@angular/common';
import { 
  IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle, IonContent, 
  IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent, 
  IonList, IonItemGroup, IonItemDivider, IonLabel, IonItem, IonSpinner,
  AlertController
} from '@ionic/angular/standalone';
import { catchError, finalize, tap } from 'rxjs/operators';
import { throwError, of } from 'rxjs';

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

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router,
    private alertController: AlertController
  ) { }

  ngOnInit() {
    const clienteId = this.route.snapshot.paramMap.get('id');
    console.log('ID do cliente recebido:', clienteId);

    if (clienteId && this.isValidMongoId(clienteId)) {
      this.carregarDadosCliente(clienteId);
    } else {
      this.handleError('ID do cliente inválido');
      this.mostrarAlertaComRedirect('ID inválido', '/gestor-clientes');
    }
  }

  private isValidMongoId(id: string): boolean {
    return /^[0-9a-fA-F]{24}$/.test(id);
  }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    if (!token) {
      this.handleError('Token de autenticação não encontrado');
      this.redirectToLogin();
      throw new Error('Token não disponível');
    }
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  private async mostrarAlertaComRedirect(message: string, redirectUrl: string) {
    const alert = await this.alertController.create({
      header: 'Aviso',
      message,
      buttons: [{
        text: 'OK',
        handler: () => {
          this.router.navigateByUrl(redirectUrl);
        }
      }]
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
  }

  carregarDadosCliente(clienteId: string): void {
    this.isLoading = true;
    this.errorMessage = null;
    const headers = this.getAuthHeaders();

    this.http.get(`${environment.api_url}/clientes/${clienteId}`, { headers }).pipe(
      tap(response => {
        if (!response) {
          throw new Error('Resposta vazia da API');
        }
      }),
      catchError((error: HttpErrorResponse) => {
        if (error.status === 404) {
          this.mostrarAlertaComRedirect('Cliente não encontrado na base de dados', '/gestor-clientes');
          return of(null);
        } else if (error.status === 401) {
          this.redirectToLogin();
          return throwError(() => new Error('Autenticação necessária'));
        } else {
          return throwError(() => new Error(`Erro na API: ${error.message}`));
        }
      }),
      finalize(() => this.isLoading = false)
    ).subscribe({
      next: (cliente: any) => {
        if (cliente) {
          this.cliente = cliente;
          // Normaliza o ID para garantir compatibilidade
          this.cliente.id = this.cliente._id ? this.cliente._id.toString() : clienteId;
          this.carregarServicos(clienteId);
        }
      },
      error: (err) => this.handleError(err.message, err)
    });
  }

  carregarServicos(clienteId: string): void {
    const headers = this.getAuthHeaders();

    this.http.get(`${environment.api_url}/servicos?clienteId=${clienteId}`, { headers }).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Erro ao carregar serviços:', error);
        return of([]);
      }),
      finalize(() => this.isLoading = false)
    ).subscribe({
      next: (servicos: any) => {
        this.servicos = servicos.map((servico: any) => ({
          ...servico,
          // Normaliza IDs dos serviços
          id: servico._id ? servico._id.toString() : servico.id
        }));
      },
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