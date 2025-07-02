import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { CommonModule } from '@angular/common';
import { 
  IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle, IonContent, 
  IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent, 
  IonList, IonItemGroup, IonItemDivider, IonLabel, IonItem 
} from '@ionic/angular/standalone';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-orcamentos-clientes',
  templateUrl: './orcamentos-clientes.page.html',
  styleUrls: ['./orcamentos-clientes.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle, IonContent,
    IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent,
    IonList, IonItemGroup, IonItemDivider, IonLabel, IonItem
  ]
})
export class OrcamentosClientesPage implements OnInit {
  cliente: any = null;
  servicos: any[] = [];
  isLoading = true;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient
  ) { }

  ngOnInit() {
    const clienteId = this.route.snapshot.paramMap.get('id');
    if (clienteId) {
      this.carregarDadosCliente(clienteId);
    } else {
      console.error('ID do cliente não encontrado na rota.');
      this.isLoading = false;
    }
  }

  carregarDadosCliente(clienteId: string) {
    this.isLoading = true;
    
    // Primeiro carrega os dados do cliente
    this.http.get(`${environment.api_url}/clientes/${clienteId}`).subscribe(
      (cliente: any) => {
        this.cliente = cliente;
        
        // Depois carrega os serviços associados
        this.http.get(`${environment.api_url}/servicos?clienteId=${clienteId}`).subscribe(
          (servicos: any) => {
            this.servicos = servicos;
            this.isLoading = false;
          },
          (error) => {
            console.error('Erro ao carregar serviços:', error);
            this.isLoading = false;
          }
        );
      },
      (error) => {
        console.error('Erro ao carregar cliente:', error);
        this.isLoading = false;
      }
    );
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('pt-PT', { 
      style: 'currency', 
      currency: 'EUR' 
    }).format(value);
  }
}