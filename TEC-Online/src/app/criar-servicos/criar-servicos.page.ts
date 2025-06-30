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
  clienteSelecionado: any = null;
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
    if (!token) {
      console.error('Token não encontrado');
      return;
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.get<any[]>(`${environment.api_url}/api/clientes/`, { headers }).subscribe({
      next: (response) => {
        this.clientes = response;
        console.log('Clientes carregados com sucesso:', this.clientes);
      },
      error: (error) => {
        console.error('Erro ao carregar clientes:', error);
        alert('Erro ao carregar lista de clientes. Verifique o console para detalhes.');
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
    this.clienteSelecionado = event.detail.value;
    console.log('Cliente selecionado:', this.clienteSelecionado);
  }

  async salvarServico() {
    // Validação dos campos obrigatórios
    if (!this.isFormValid()) {
      alert('Por favor, preencha todos os campos obrigatórios corretamente.');
      return;
    }

    // Validação específica do cliente
    if (!this.clienteSelecionado?.id) {
      alert('Por favor, selecione um cliente válido da lista.');
      return;
    }

    // Preparação dos dados para a API
    const dadosServico = {
      data_servico: this.dataServico,
      hora_servico: this.horaServico,
      status: this.status,
      autor_servico: this.autorServico,
      cliente_id: this.clienteSelecionado.id,
      nome_cliente: this.clienteSelecionado.nome,
      marca_aparelho: this.marcaAparelho,
      modelo_aparelho: this.modeloAparelho,
      problema_cliente: this.problemaCliente,
      solucao_inicial: this.solucaoInicial,
      valor_total: this.valorTotal || 0,
      observacoes: this.observacoes || 'Sem observações'
    };

    console.log('Enviando dados para a API:', dadosServico);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Token de autenticação não encontrado');
      }

      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      });

      const resposta = await this.http.post(
        `${environment.api_url}/api/servicos/`,
        dadosServico,
        { headers }
      ).toPromise();

      console.log('Serviço criado com sucesso:', resposta);
      alert('Serviço registrado com sucesso!');
      this.router.navigate(['/plano-semanal']);

    } catch (error) {
      console.error('Erro ao criar serviço:', error);
      let mensagem = 'Erro ao criar serviço.';
      
      if (typeof error === 'object' && error !== null && 'error' in error && (error as any).error?.message) {
        mensagem += ` Detalhes: ${(error as any).error.message}`;
      } else if (typeof error === 'object' && error !== null && 'message' in error) {
        mensagem += ` Erro: ${(error as any).message}`;
      }
      
      alert(mensagem);
    }
  }

  isFormValid(): boolean {
    return !!(
      this.dataServico &&
      this.horaServico &&
      this.status &&
      this.autorServico &&
      this.clienteSelecionado?.id &&
      this.marcaAparelho &&
      this.modeloAparelho &&
      this.problemaCliente
    );
  }

  goBack() {
    this.navController.back();
  }
}