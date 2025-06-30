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
  problemaCliente: string = ''; // Corrigido o nome da propriedade
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
    return o1 && o2 ? o1.id === o2.id : o1 === o2;
  }

  onClienteChange(event: any) {
    this.clienteId = event.detail.value;
    console.log('Cliente selecionado:', this.clienteId);
  }

  salvarServico() {
    if (!this.isFormValid()) {
      alert('Preencha todos os campos obrigatórios.');
      return;
    }

    if (!this.clienteId) {
      alert('Por favor, selecione um cliente válido.');
      return;
    }

    const novoServico = {
      data_servico: this.dataServico, // Alterado para data_servico (com underscore)
      hora_servico: this.horaServico, // Alterado para hora_servico
      status: this.status,
      autor_servico: this.autorServico, // Alterado para autor_servico
      cliente_id: this.clienteId.id, // Alterado para cliente_id
      nome_cliente: this.clienteId.nome, // Alterado para nome_cliente
      marca_aparelho: this.marcaAparelho, // Alterado para marca_aparelho
      modelo_aparelho: this.modeloAparelho, // Alterado para modelo_aparelho
      problema_cliente: this.problemaCliente, // Alterado para problema_cliente
      solucao_inicial: this.solucaoInicial, // Alterado para solucao_inicial
      valor_total: this.valorTotal, // Alterado para valor_total
      observacoes: this.observacoes || 'Sem observações',
    };

    console.log('Dados sendo enviados:', novoServico); // Adicionado log para debug

    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.post(`${environment.api_url}/api/servicos/`, novoServico, { headers }).subscribe({
      next: () => {
        alert('Serviço criado com sucesso!');
        this.router.navigate(['/plano-semanal']);
      },
      error: (error) => {
        console.error('Erro ao criar serviço:', error);
        console.error('Detalhes do erro:', error.error); // Mostra detalhes do erro
        alert(`Erro ao criar serviço: ${error.error?.message || 'Verifique os dados e tente novamente'}`);
      }
    });
  }

  isFormValid(): boolean {
    return !!(
      this.dataServico &&
      this.horaServico &&
      this.status &&
      this.autorServico &&
      this.clienteId &&
      this.marcaAparelho &&
      this.modeloAparelho &&
      this.problemaCliente
    );
  }

  goBack() {
    this.navController.back();
  }
}