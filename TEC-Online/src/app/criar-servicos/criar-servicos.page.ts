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
import { IonSearchbar, IonItem, IonLabel, IonList } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment.prod';
import { debounceTime, distinctUntilChanged, Subject, switchMap } from 'rxjs';

@Component({
  selector: 'app-criar-servicos',
  standalone: true,
  templateUrl: './criar-servicos.page.html',
  styleUrls: ['./criar-servicos.page.scss'],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    IonSearchbar,
    IonItem,
    IonLabel,
    IonList
  ],
})
export class CriarServicosPage implements OnInit {
  // Campos do formulário
  dataServico = '';
  horaServico = '';
  status = 'aberto';
  autorServico = '';
  clienteSelecionadoId: string | null = null;
  clienteSelecionadoNome: string = '';
  marcaAparelho = '';
  modeloAparelho = '';
  problemaRelatado = '';
  solucaoInicial = '';
  valorTotal: number | null = null;
  observacoes = '';

  // Clientes
  clientesEncontrados: any[] = [];
  pesquisaCliente$ = new Subject<string>();

  constructor(
    private http: HttpClient,
    private navController: NavController,
    private router: Router,
    private toastController: ToastController,
    private alertController: AlertController,
    private loadingController: LoadingController
  ) {}

  ngOnInit() {
    this.inicializarDados();
    this.configurarBuscaClientes();
  }

  inicializarDados() {
    const hoje = new Date();
    this.dataServico = hoje.toISOString().split('T')[0];
    this.horaServico = this.formatarHora(hoje);
    this.autorServico = localStorage.getItem('username') || 'Técnico';
  }

  formatarHora(data: Date): string {
    return `${data.getHours().toString().padStart(2, '0')}:${data.getMinutes().toString().padStart(2, '0')}`;
  }

  configurarBuscaClientes() {
    this.pesquisaCliente$
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((termo) => this.buscarClientes(termo))
      )
      .subscribe((clientes) => {
        this.clientesEncontrados = clientes;
      });
  }

  buscarClientes(termo: string): Promise<any[]> {
    if (!termo || termo.trim().length < 2) return Promise.resolve([]);

    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http
      .get<any[]>(`${environment.api_url}/api/clientes/busca?nome=${encodeURIComponent(termo)}`, { headers })
      .toPromise()
      .then((res) => res || [])
      .catch(() => []);
  }

  selecionarCliente(cliente: any) {
    this.clienteSelecionadoId = cliente._id || cliente.id;
    this.clienteSelecionadoNome = cliente.nome;
    this.clientesEncontrados = [];
  }

  async salvarServico() {
    if (!this.isFormValid()) {
      const toast = await this.toastController.create({
        message: 'Preencha todos os campos obrigatórios!',
        duration: 3000,
        color: 'warning',
      });
      await toast.present();
      return;
    }

    const loading = await this.loadingController.create({ message: 'Salvando serviço...' });
    await loading.present();

    try {
      const dadosServico = {
        dataServico: this.dataServico,
        horaServico: this.horaServico,
        status: this.status,
        autorServico: this.autorServico,
        clienteId: this.clienteSelecionadoId,
        nomeCompletoCliente: this.clienteSelecionadoNome,
        contatoCliente: '', // Pode preencher com mais info depois
        marcaAparelho: this.marcaAparelho,
        modeloAparelho: this.modeloAparelho,
        problemaRelatado: this.problemaRelatado,
        solucaoInicial: this.solucaoInicial || 'A definir',
        valorTotal: Number(this.valorTotal) || 0,
        observacoes: this.observacoes || 'Sem observações',
      };

      const token = localStorage.getItem('token');
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      });

      await this.http.post(`${environment.api_url}/api/servicos`, dadosServico, { headers }).toPromise();

      const toast = await this.toastController.create({
        message: 'Serviço criado com sucesso!',
        duration: 2000,
        color: 'success'
      });
      await toast.present();

      this.router.navigate(['/plano-semanal', this.clienteSelecionadoId]);
    } catch (error: any) {
      const alert = await this.alertController.create({
        header: 'Erro',
        message: error.error?.message || 'Erro ao criar serviço',
        buttons: ['OK']
      });
      await alert.present();
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
      this.clienteSelecionadoId &&
      this.marcaAparelho &&
      this.modeloAparelho &&
      this.problemaRelatado
    );
  }

  goBack() {
    this.navController.back();
  }
}
