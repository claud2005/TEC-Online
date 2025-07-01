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
  clienteSelecionado: string | null = null; // ID do cliente
  marcaAparelho: string = '';
  modeloAparelho: string = '';
  problemaRelatado: string = '';
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
    this.carregarClientes();
  }

  carregarDadosIniciais() {
    const hoje = new Date();
    this.dataServico = hoje.toISOString().split('T')[0];
    this.horaServico = this.formatarHora(hoje);
    this.autorServico = localStorage.getItem('username') || 'Técnico';
  }

  formatarHora(data: Date): string {
    const horas = data.getHours().toString().padStart(2, '0');
    const minutos = data.getMinutes().toString().padStart(2, '0');
    return `${horas}:${minutos}`;
  }

  carregarClientes() {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Token não encontrado');
      this.clientes = [];
      return;
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.get<any[]>(`${environment.api_url}/api/clientes/`, { headers }).subscribe({
      next: (response) => {
        console.log('Resposta completa da API:', response);

        this.clientes = response.map(cliente => ({
          id: cliente.id,                    // ou cliente._id dependendo do backend
          nome: cliente.nome,
          numeroCliente: cliente.numeroCliente // ou cliente.telefone se vier assim
        }));

        console.log('Clientes formatados:', this.clientes);
      },
      error: (error) => {
        console.error('Erro ao carregar clientes:', error);
        this.clientes = [];
      }
    });
  }

  onClienteChange(event: any) {
    this.clienteSelecionado = event.detail.value;
    console.log('Cliente selecionado agora:', this.clienteSelecionado);
  }

  async salvarServico() {
    if (!this.isFormValid()) {
      alert('Por favor, preencha todos os campos obrigatórios corretamente.');
      return;
    }

    console.log('Tentando achar cliente com ID:', this.clienteSelecionado);
    const cliente = this.clientes.find(c => c.id === this.clienteSelecionado);
    console.log('Cliente encontrado:', cliente);

    if (!cliente) {
      alert('Cliente selecionado não encontrado.');
      return;
    }

    const dadosServico = {
      dataServico: this.dataServico,
      horaServico: this.horaServico,
      status: this.status,
      autorServico: this.autorServico,
      clienteId: cliente.id,               // ID real do cliente
      cliente: cliente.nome,               // campo 'cliente' no schema (required)
      nomeCompletoCliente: cliente.nome,   // campo 'nomeCompletoCliente' no schema
      contatoCliente: cliente.numeroCliente, // campo 'contatoCliente' no schema
      marcaAparelho: this.marcaAparelho,
      modeloAparelho: this.modeloAparelho,
      problemaRelatado: this.problemaRelatado,
      solucaoInicial: this.solucaoInicial,
      valorTotal: this.valorTotal || 0,
      observacoes: this.observacoes || 'Sem observações'
    };

    console.log('Dados a serem enviados:', dadosServico);

    try {
      const token = localStorage.getItem('token');
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      });

      await this.http.post(
        `${environment.api_url}/api/servicos/`,
        dadosServico,
        { headers }
      ).toPromise();

      alert('Serviço criado com sucesso!');
      this.router.navigate(['/orcamentos-clientes', cliente.id]);
    } catch (error) {
      console.error('Erro ao criar serviço:', error);
      alert('Erro ao criar serviço. Verifique o console.');
    }
  }

  isFormValid(): boolean {
    return !!(
      this.dataServico &&
      this.horaServico &&
      this.status &&
      this.autorServico &&
      this.clienteSelecionado &&
      this.marcaAparelho &&
      this.modeloAparelho &&
      this.problemaRelatado &&
      this.solucaoInicial
    );
  }

  goBack() {
    this.navController.back();
  }
}
