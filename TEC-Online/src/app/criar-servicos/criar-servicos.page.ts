import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { NavController, IonicModule, ToastController, AlertController, LoadingController } from '@ionic/angular';
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
  
  // novo: input e cliente selecionado
  clienteInput: string = '';
  clienteSelecionado: any = null; // guarda objeto cliente

  marcaAparelho: string = '';
  modeloAparelho: string = '';
  problemaRelatado: string = '';
  solucaoInicial: string = '';
  valorTotal: number | null = null;
  observacoes: string = '';

  clientes: any[] = [];
  clientesFiltrados: any[] = [];
  mostrarAutocomplete: boolean = false;

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

      this.clientesFiltrados = [...this.clientes];
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
    const texto = this.clienteInput.toLowerCase().trim();
    if (texto.length === 0) {
      this.clientesFiltrados = [...this.clientes];
      this.clienteSelecionado = null;
      return;
    }

    this.clientesFiltrados = this.clientes.filter(c =>
      c.nome.toLowerCase().includes(texto)
    );
    this.clienteSelecionado = null;
  }

  selecionarCliente(cliente: any) {
    this.clienteSelecionado = cliente;
    this.clienteInput = cliente.nome;
    this.mostrarAutocomplete = false;
  }

  // Para evitar fechar o dropdown ao clicar no item, delay para fechar depois do blur
  onBlurCliente() {
    setTimeout(() => {
      this.mostrarAutocomplete = false;
      if (!this.clienteSelecionado || this.clienteInput !== this.clienteSelecionado.nome) {
        this.clienteSelecionado = null;
      }
    }, 200);
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

    if (!this.clienteSelecionado) {
      const toast = await this.toastController.create({
        message: 'Por favor, selecione um cliente da lista',
        duration: 3000,
        color: 'warning'
      });
      await toast.present();
      return;
    }

    const novoServico = {
      dataServico: this.dataServico,
      horaServico: this.horaServico,
      status: this.status,
      autorServico: this.autorServico,
      cliente: this.clienteSelecionado,
      marcaAparelho: this.marcaAparelho,
      modeloAparelho: this.modeloAparelho,
      problemaRelatado: this.problemaRelatado,
      solucaoInicial: this.solucaoInicial,
      valorTotal: this.valorTotal,
      observacoes: this.observacoes,
    };

    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Token não encontrado');

      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      await this.http.post(
        `${environment.api_url}/api/servicos`,
        novoServico,
        { headers }
      ).toPromise();

      const toast = await this.toastController.create({
        message: 'Serviço criado com sucesso!',
        duration: 2500,
        color: 'success'
      });
      await toast.present();
      this.router.navigate(['/servicos']);
    } catch (error) {
      console.error('Erro ao salvar serviço:', error);
      const alert = await this.alertController.create({
        header: 'Erro',
        message: 'Não foi possível salvar o serviço.',
        buttons: ['OK']
      });
      await alert.present();
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
      this.problemaRelatado
    );
  }

  goBack() {
    this.navController.back();
  }
}
