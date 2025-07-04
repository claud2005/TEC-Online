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
        // Corrigido: usar _id do Mongo
        this.clientes = response.map(cliente => ({
          id: cliente._id,
          nome: cliente.nome,
          numeroCliente: cliente.numeroCliente // ou telefone
        }));
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

    const cliente = this.clientes.find(c => c.id === this.clienteSelecionado);

    if (!cliente) {
      alert('Cliente selecionado não encontrado.');
      return;
    }

    const dadosServico = {
      dataServico: this.dataServico,
      horaServico: this.horaServico,
      status: this.status,
      autorServico: this.autorServico,
      clienteId: cliente.id,  // Enviar clienteId (correto)
      nomeCompletoCliente: cliente.nome,
      contatoCliente: cliente.numeroCliente,
      marcaAparelho: this.marcaAparelho,
      modeloAparelho: this.modeloAparelho,
      problemaRelatado: this.problemaRelatado,
      solucaoInicial: this.solucaoInicial,
      valorTotal: this.valorTotal || 0,
      observacoes: this.observacoes || 'Sem observações'
    };

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
      this.router.navigate(['/plano-semanal', cliente.id]);
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
