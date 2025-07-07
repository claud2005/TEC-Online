import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { NavController, IonicModule, ToastController, AlertController, LoadingController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
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
  ],
})
export class CriarServicosPage implements OnInit {
  dataServico: string = '';
  horaServico: string = '';
  status: string = 'aberto';
  autorServico: string = '';

  // Multi-select clientes
  termoPesquisa: string = '';
  mostrarSugestoes = false;
  clientes: any[] = [];
  clientesFiltrados: any[] = [];
  clientesSelecionados: any[] = [];

  marcaAparelho: string = '';
  modeloAparelho: string = '';
  problemaRelatado: string = '';
  solucaoInicial: string = '';
  valorTotal: number | null = null;
  observacoes: string = '';

  constructor(
    private http: HttpClient,
    private navController: NavController,
    private router: Router,
    private toastController: ToastController,
    private alertController: AlertController,
    private loadingController: LoadingController
  ) {}

  async ngOnInit() {
    await this.carregarDadosIniciais();
    await this.carregarClientes();
  }

  async carregarDadosIniciais() {
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

  async carregarClientes() {
    const loading = await this.loadingController.create({
      message: 'Carregando clientes...'
    });
    await loading.present();

    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Token não encontrado');

      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

      const response = await this.http.get<any[]>(
        `${environment.api_url}/api/clientes`,
        { headers }
      ).toPromise();

      this.clientes = response?.map(cliente => ({
        id: cliente.id || cliente._id,
        nome: cliente.nome,
        numeroCliente: cliente.numeroCliente || cliente.contacto
      })) || [];

    } catch (error) {
      console.error('Erro ao carregar clientes:', error);
      const alert = await this.alertController.create({
        header: 'Erro',
        message: 'Não foi possível carregar a lista de clientes',
        buttons: ['OK']
      });
      await alert.present();
    } finally {
      await loading.dismiss();
    }
  }

  filtrarClientes() {
    const termo = this.termoPesquisa.toLowerCase().trim();

    if (termo.length < 2) {
      this.clientesFiltrados = [];
      return;
    }

    this.clientesFiltrados = this.clientes.filter(cliente =>
      cliente.nome.toLowerCase().includes(termo) &&
      !this.clientesSelecionados.some(sel => sel.id === cliente.id)
    );
  }

  adicionarCliente(cliente: any) {
    this.clientesSelecionados.push(cliente);
    this.termoPesquisa = '';
    this.clientesFiltrados = [];
    this.mostrarSugestoes = false;
  }

  removerCliente(index: number) {
    this.clientesSelecionados.splice(index, 1);
  }

  onBlurInput() {
    setTimeout(() => {
      this.mostrarSugestoes = false;
    }, 200);
  }

  isFormValid(): boolean {
    return !!(
      this.dataServico &&
      this.horaServico &&
      this.status &&
      this.autorServico &&
      this.clientesSelecionados.length > 0 &&
      this.marcaAparelho &&
      this.modeloAparelho &&
      this.problemaRelatado
    );
  }

  async salvarServico() {
    if (!this.isFormValid()) {
      const toast = await this.toastController.create({
        message: 'Por favor, preencha todos os campos obrigatórios!',
        duration: 3000,
        color: 'warning'
      });
      await toast.present();
      return;
    }

    const loading = await this.loadingController.create({
      message: 'Salvando serviço...'
    });
    await loading.present();

    try {
      // Para exemplo, vamos salvar o serviço para o primeiro cliente selecionado
      // ou você pode adaptar para salvar para todos ou outro fluxo que desejar
      const cliente = this.clientesSelecionados[0];
      if (!cliente) throw new Error('Cliente não encontrado');

      const dadosServico = {
        dataServico: this.dataServico,
        horaServico: this.horaServico,
        status: this.status.replace('_', '-'),
        autorServico: this.autorServico,
        clienteId: cliente.id,
        nomeCompletoCliente: cliente.nome,
        contatoCliente: cliente.numeroCliente || 'Não informado',
        marcaAparelho: this.marcaAparelho,
        modeloAparelho: this.modeloAparelho,
        problemaRelatado: this.problemaRelatado,
        solucaoInicial: this.solucaoInicial || 'A definir',
        valorTotal: Number(this.valorTotal) || 0,
        observacoes: this.observacoes || 'Sem observações'
      };

      const token = localStorage.getItem('token');
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      });

      await this.http.post(
        `${environment.api_url}/api/servicos`,
        dadosServico,
        { headers }
      ).toPromise();

      const toast = await this.toastController.create({
        message: 'Serviço criado com sucesso!',
        duration: 2000,
        color: 'success'
      });
      await toast.present();

      this.router.navigate(['/plano-semanal', cliente.id]);
    } catch (error: any) {
      console.error('Erro ao criar serviço:', error);

      const alert = await this.alertController.create({
        header: 'Erro',
        message: error.error?.message || 'Falha ao criar serviço',
        buttons: ['OK']
      });
      await alert.present();
    } finally {
      await loading.dismiss();
    }
  }

  goBack() {
    this.navController.back();
  }
}
