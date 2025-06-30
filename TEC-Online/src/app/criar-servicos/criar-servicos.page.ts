import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { NavController, IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { IonSelect, IonSelectOption } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-criar-servicos',
  standalone: true,
  templateUrl: './criar-servicos.page.html',
  styleUrls: ['./criar-servicos.page.scss'],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    IonSelect,
    IonSelectOption,
  ],
})
export class CriarServicosPage implements OnInit {
  dataServico: string = '';
  horaServico: string = '';
  status: string = 'aberto';
  autorServico: string = '';
  clienteId: any = null;
  marcaAparelho: string = '';
  modeloAparelho: string = '';
  problemaCliente: string = '';
  solucaoInicial: string = '';
  valorTotal: number | null = null;
  observacoes: string = '';

  clientes: any[] = [];

  constructor(
    private http: HttpClient,
    private navController: NavController,
    private router: Router
  ) {}

  ngOnInit() {
    this.carregarDadosIniciais();
  }

  carregarDadosIniciais() {
    const hoje = new Date();
    this.dataServico = hoje.toISOString().split('T')[0];
    this.autorServico = localStorage.getItem('username') || '';
    this.carregarClientes();
  }

  carregarClientes() {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.get<any[]>(`${environment.api_url}/api/clientes/`, { headers }).subscribe({
      next: (response) => {
        this.clientes = response;
        console.log('Clientes carregados:', this.clientes);
      },
      error: (error) => {
        console.error('Erro ao carregar clientes:', error);
        alert('Erro ao carregar lista de clientes.');
      }
    });
  }

  compareWithClientes(o1: any, o2: any) {
    if (!o1 || !o2) return false;
    if (typeof o1 === 'object' && typeof o2 === 'object') {
      return o1.id === o2.id;
    }
    return o1 === o2;
  }

  onClienteChange(event: any) {
    console.log('Evento de seleção:', event);
    this.clienteId = event.detail.value;
    console.log('Cliente selecionado:', this.clienteId);
    console.log('Tipo do clienteId:', typeof this.clienteId);
  }

  salvarServico() {
    console.log('Validando formulário...');
    console.log('Cliente atual:', this.clienteId);

    if (!this.isFormValid()) {
      alert('Preencha todos os campos obrigatórios.');
      return;
    }

    if (!this.clienteId || (typeof this.clienteId === 'object' && !this.clienteId.id)) {
      alert('Por favor, selecione um cliente válido.');
      return;
    }

    const novoServico = {
      data_servico: this.dataServico,
      hora_servico: this.horaServico,
      status: this.status,
      autor_servico: this.autorServico,
      cliente_id: typeof this.clienteId === 'object' ? this.clienteId.id : this.clienteId,
      nome_cliente: typeof this.clienteId === 'object' ? this.clienteId.nome : '',
      marca_aparelho: this.marcaAparelho,
      modelo_aparelho: this.modeloAparelho,
      problema_cliente: this.problemaCliente,
      solucao_inicial: this.solucaoInicial,
      valor_total: this.valorTotal,
      observacoes: this.observacoes || 'Sem observações',
    };

    console.log('Dados a serem enviados:', novoServico);

    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.post(`${environment.api_url}/api/servicos/`, novoServico, { headers }).subscribe({
      next: () => {
        alert('Serviço criado com sucesso!');
        this.router.navigate(['/plano-semanal']);
      },
      error: (error) => {
        console.error('Erro completo:', error);
        console.error('Detalhes do erro:', error.error);
        alert(`Erro ao criar serviço: ${error.error?.message || error.message || 'Verifique os dados e tente novamente'}`);
      }
    });
  }

  isFormValid(): boolean {
    const clienteValido = typeof this.clienteId === 'object' ? 
      (this.clienteId && this.clienteId.id) : 
      (this.clienteId !== null && this.clienteId !== undefined);

    return !!(
      this.dataServico &&
      this.horaServico &&
      this.status &&
      this.autorServico &&
      clienteValido &&
      this.marcaAparelho &&
      this.modeloAparelho &&
      this.problemaCliente
    );
  }

  goBack() {
    this.navController.back();
  }
}