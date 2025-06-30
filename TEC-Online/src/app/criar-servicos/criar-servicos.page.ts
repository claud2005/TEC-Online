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
  clienteId: string = ''; // Alterado para armazenar ID do cliente
  telefoneContato: string = '';
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
    const hoje = new Date();
    this.dataServico = hoje.toISOString().split('T')[0];
    this.autorServico = localStorage.getItem('username') || '';
    this.carregarClientes();
  }

  carregarClientes() {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.get<any[]>(`${environment.api_url}/api/clientes/`, { headers }).subscribe(
      (response) => {
        this.clientes = response;
      },
      (error) => {
        console.error('Erro ao carregar clientes:', error);
        alert('Erro ao carregar lista de clientes.');
      }
    );
  }

  salvarServico() {
    if (!this.isFormValid()) {
      alert('Preencha todos os campos obrigatórios.');
      return;
    }

    const clienteSelecionado = this.clientes.find(c => c.id === this.clienteId);
    if (!clienteSelecionado) {
      alert('Cliente selecionado inválido.');
      return;
    }

    const novoServico = {
      dataServico: this.dataServico,
      horaServico: this.horaServico,
      status: this.status,
      autorServico: this.autorServico,
      clienteId: this.clienteId, // ID do cliente
      nomeCliente: clienteSelecionado.nome, // Nome para referência
      telefoneContato: clienteSelecionado.telefone || this.telefoneContato,
      marcaAparelho: this.marcaAparelho,
      modeloAparelho: this.modeloAparelho,
      problemaCliente: this.problemaCliente,
      solucaoInicial: this.solucaoInicial,
      valorTotal: this.valorTotal,
      observacoes: this.observacoes || 'Sem observações',
    };

    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.post(`${environment.api_url}/api/servicos/`, novoServico, { headers }).subscribe(
      (response) => {
        alert('Serviço criado com sucesso!');
        this.router.navigate(['/plano-semanal']);
      },
      (error) => {
        console.error('Erro ao criar serviço:', error);
        alert('Erro ao criar serviço. Verifique o console para detalhes.');
      }
    );
  }

  isFormValid(): boolean {
    return !!(
      this.dataServico &&
      this.horaServico &&
      this.status &&
      this.autorServico &&
      this.clienteId && // Validação do ID do cliente
      this.marcaAparelho &&
      this.modeloAparelho &&
      this.problemaCliente
    );
  }

  goBack() {
    this.navController.back();
  }
}