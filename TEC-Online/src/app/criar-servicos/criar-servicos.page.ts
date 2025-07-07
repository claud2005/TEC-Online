import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { 
  NavController, 
  IonicModule, 
  ToastController, 
  AlertController, 
  LoadingController 
} from '@ionic/angular';
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
  clienteSelecionado: string | null = null;
  marcaAparelho: string = '';
  modeloAparelho: string = '';
  problemaRelatado: string = '';
  solucaoInicial: string = '';
  valorTotal: number | null = null;
  observacoes: string = '';

  // Variáveis para gestão de clientes
  mostrarSearchbar: boolean = false;
  searchTerm: string = '';
  clientes: any[] = [];
  clientesFiltrados: any[] = [];

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
  }

  async carregarDadosIniciais() {
    const hoje = new Date();
    this.dataServico = hoje.toISOString().split('T')[0];
    this.horaServico = this.formatarHora(hoje);
    this.autorServico = localStorage.getItem('username') || 'Técnico';
  }

  formatarHora(data: Date): string {
    return data.getHours().toString().padStart(2, '0') + ':' + 
           data.getMinutes().toString().padStart(2, '0');
  }

  async carregarTodosClientes() {
    const loading = await this.loadingController.create({
      message: 'A carregar clientes...',
      duration: 5000
    });
    await loading.present();

    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Autenticação necessária');

      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      const response = await this.http.get<any[]>(
        `${environment.api_url}/api/clientes?sort=nome`,
        { headers }
      ).toPromise();

      this.clientes = (response || []).sort((a, b) => 
        a.nome.localeCompare(b.nome, 'pt')
      );
      this.clientesFiltrados = [...this.clientes];
      this.mostrarSearchbar = true;

    } catch (error) {
      console.error('Erro ao carregar clientes:', error);
      this.mostrarAlerta('Erro', 'Falha ao carregar lista de clientes');
    } finally {
      await loading.dismiss();
    }
  }

  filtrarClientes() {
    if (!this.searchTerm.trim()) {
      this.clientesFiltrados = [...this.clientes];
      return;
    }

    const termo = this.searchTerm.toLowerCase();
    this.clientesFiltrados = this.clientes.filter(cliente => 
      cliente.nome.toLowerCase().includes(termo) || 
      (cliente.email && cliente.email.toLowerCase().includes(termo))
    );
  }

  async salvarServico() {
    if (!this.isFormValid()) {
      this.mostrarToast('Preencha todos os campos obrigatórios!', 'warning');
      return;
    }

    const loading = await this.loadingController.create({
      message: 'A guardar serviço...'
    });
    await loading.present();

    try {
      const dadosServico = {
        dataServico: this.dataServico,
        horaServico: this.horaServico,
        status: this.status,
        autorServico: this.autorServico,
        clienteId: this.clienteSelecionado,
        marcaAparelho: this.marcaAparelho,
        modeloAparelho: this.modeloAparelho,
        problemaRelatado: this.problemaRelatado,
        solucaoInicial: this.solucaoInicial || 'A definir',
        valorTotal: this.valorTotal || 0,
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

      this.mostrarToast('Serviço criado com sucesso!', 'success');
      this.router.navigate(['/servicos']);

    } catch (error: any) {
      console.error('Erro:', error);
      this.mostrarAlerta(
        'Erro', 
        error.error?.message || 'Falha ao criar serviço'
      );
    } finally {
      await loading.dismiss();
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

  private async mostrarToast(mensagem: string, cor: string) {
    const toast = await this.toastController.create({
      message: mensagem,
      duration: 3000,
      color: cor
    });
    await toast.present();
  }

  private async mostrarAlerta(titulo: string, mensagem: string) {
    const alert = await this.alertController.create({
      header: titulo,
      message: mensagem,
      buttons: ['OK']
    });
    await alert.present();
  }

  goBack() {
    this.navController.back();
  }
}