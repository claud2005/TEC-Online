import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AlertController, IonicModule } from '@ionic/angular';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-orcamentos-clientes',
  templateUrl: './orcamentos-clientes.page.html',
  styleUrls: ['./orcamentos-clientes.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonicModule // Importa todos os componentes do Ionic
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
  ) {}

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
      this.handleError('Autenticação necessária - Token não encontrado');
      throw new Error('Token não disponível');
    }
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  carregarDadosCliente(clienteId: string): void {
    this.isLoading = true;
    this.errorMessage = null;
    const headers = this.getAuthHeaders();

    this.http.get(`${environment.api_url}/clientes/${clienteId}`, { headers }).subscribe({
      next: (cliente: any) => {
        this.cliente = cliente;
        this.carregarServicos(clienteId);
      },
      error: (error) => {
        if (error.status === 404) {
          this.handleError('Cliente não encontrado na base de dados');
        } else {
          this.handleError('Erro ao carregar dados do cliente');
        }
      }
    });
  }

  carregarServicos(clienteId: string): void {
    const headers = this.getAuthHeaders();

    this.http.get(`${environment.api_url}/servicos?clienteId=${clienteId}`, { headers }).subscribe({
      next: (servicos: any) => {
        this.servicos = servicos;
        this.isLoading = false;
      },
      error: (error) => {
        this.handleError('Erro ao carregar serviços do cliente');
        this.isLoading = false;
      }
    });
  }

  private handleError(message: string): void {
    this.errorMessage = message;
    this.isLoading = false;
    this.showAlert(message);
  }

  private async showAlert(message: string) {
    const alert = await this.alertController.create({
      header: 'Aviso',
      message,
      buttons: ['OK']
    });
    await alert.present();
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