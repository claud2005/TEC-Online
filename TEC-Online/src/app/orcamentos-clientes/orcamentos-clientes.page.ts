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
import { catchError, finalize } from 'rxjs/operators';
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

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router,
    private alertController: AlertController
  ) { }

  ngOnInit() {
    const clienteId = this.route.snapshot.paramMap.get('id');
    console.log('ID do cliente recebido:', clienteId);
    
    if (clienteId) {
      this.carregarDadosCliente(clienteId);
    } else {
      this.handleError('ID do cliente não encontrado na URL');
      this.mostrarAlertaERedirect('ID inválido', 'ID do cliente não encontrado na URL', '/gestor-clientes');
    }
  }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
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

  private async mostrarAlertaERedirect(titulo: string, mensagem: string, redirectUrl: string) {
    const alert = await this.alertController.create({
      header: titulo,
      message: mensagem,
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

    // Primeiro verifica se o cliente existe
    this.http.get(`${environment.api_url}/clientes/${clienteId}`, { headers }).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 404) {
          this.mostrarAlertaERedirect(
            'Cliente não encontrado', 
            'O cliente solicitado não foi encontrado na base de dados.', 
            '/gestor-clientes'
          );
        } else if (error.status === 401) {
          this.redirectToLogin();
        } else {
          this.handleError('Erro ao conectar com o servidor');
        }
        return of(null);
      })
    ).subscribe(cliente => {
      if (cliente) {
        this.cliente = cliente;
        // Normaliza o ID para garantir compatibilidade
        this.cliente.id = this.cliente._id ? this.cliente._id.toString() : clienteId;
        this.carregarServicos(clienteId);
      }
      this.isLoading = false;
    });
  }

  carregarServicos(clienteId: string): void {
    const headers = this.getAuthHeaders();

    this.http.get(`${environment.api_url}/servicos?clienteId=${clienteId}`, { headers }).pipe(
      catchError(error => {
        console.error('Erro ao carregar serviços:', error);
        return of([]);
      }),
      finalize(() => this.isLoading = false)
    ).subscribe(servicos => {
      this.servicos = Array.isArray(servicos) ? servicos : [];
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