import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
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
      this.errorMessage = 'ID do cliente não encontrado na URL';
      this.isLoading = false;
    }
  }

  carregarDadosCliente(clienteId: string) {
    this.isLoading = true;
    this.errorMessage = null;
    
    // Carrega dados do cliente
    this.http.get(`${environment.api_url}/clientes/${clienteId}`).pipe(
      catchError(error => {
        console.error('Erro ao carregar cliente:', error);
        this.errorMessage = 'Erro ao carregar dados do cliente';
        return of(null);
      }),
      finalize(() => this.isLoading = false)
    ).subscribe(cliente => {
      if (cliente) {
        this.cliente = cliente;
        this.carregarServicos(clienteId);
      }
    });
  }

  carregarServicos(clienteId: string) {
    this.isLoading = true;
    this.http.get(`${environment.api_url}/servicos?clienteId=${clienteId}`).pipe(
      catchError(error => {
        console.error('Erro ao carregar serviços:', error);
        this.errorMessage = 'Erro ao carregar serviços';
        return of([]);
      }),
      finalize(() => this.isLoading = false)
    ).subscribe(servicos => {
      this.servicos = servicos as any[];
    });
  }

  formatCurrency(value: number): string {
    return value.toLocaleString('pt-PT', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }
}