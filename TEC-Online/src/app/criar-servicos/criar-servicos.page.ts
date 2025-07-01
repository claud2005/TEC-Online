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
      return;
    }

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
    this.clienteSelecionado = event.detail.value;
    console.log('Cliente selecionado:', this.clienteSelecionado);
    console.log('Formulário válido?', this.isFormValid());
  }

  async salvarServico() {
    if (!this.isFormValid()) {
      alert('Por favor, preencha todos os campos obrigatórios corretamente.');
      return;
    }

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
      this.router.navigate(['/plano-semanal']);
    } catch (error) {
      console.error('Erro:', error);
      alert('Erro ao criar serviço. Verifique o console.');
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