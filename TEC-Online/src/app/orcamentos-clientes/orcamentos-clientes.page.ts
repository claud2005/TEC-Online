import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { CommonModule } from '@angular/common';
import { 
  IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle, IonContent, 
  IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent, 
  IonList, IonItemGroup, IonItemDivider, IonLabel, IonItem, IonSpinner 
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
    private http: HttpClient
  ) { }

  ngOnInit() {
    const clienteId = this.route.snapshot.paramMap.get('id');
    if (clienteId) {
      this.carregarDadosCliente(clienteId);
    } else {
      this.handleError('ID do cliente não encontrado na URL');
    }
  }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Token JWT não encontrado no localStorage');
      this.handleError('Autenticação necessária');
      throw new Error('Token não disponível');
    }
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
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

    // Primeiro carrega o cliente
    this.http.get(`${environment.api_url}/clientes/${clienteId}`, { headers }).pipe(
      catchError(error => {
        this.handleError(
          error.status === 404 
            ? 'Cliente não encontrado' 
            : 'Erro ao carregar dados do cliente',
          error
        );
        return of(null);
      })
    ).subscribe(cliente => {
      if (cliente) {
        this.cliente = cliente;
        this.carregarServicos(clienteId);
      }
    });
  }

  carregarServicos(clienteId: string): void {
    const headers = this.getAuthHeaders();

    this.http.get(`${environment.api_url}/servicos?clienteId=${clienteId}`, { headers }).pipe(
      catchError(error => {
        this.handleError('Erro ao carregar serviços do cliente', error);
        return of([]);
      }),
      finalize(() => this.isLoading = false)
    ).subscribe(servicos => {
      this.servicos = servicos as any[];
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