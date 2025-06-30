import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // <-- adicione isso
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { NavController, IonicModule } from '@ionic/angular';
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
    IonicModule,
    FormsModule, // <-- adicione aqui
    IonSelect,
    IonSelectOption,
  ],
})
export class CriarServicosPage implements OnInit {
  dataServico: string = '';
  horaServico: string = '';
  status: string = 'aberto';
  autorServico: string = '';
  nomeCliente: string = '';
  telefoneContato: string = '';
  marcaAparelho: string = '';
  modeloAparelho: string = '';
  problemaCliente: string = '';
  solucaoInicial: string = '';
  valorTotal: number | null = null;
  observacoes: string = '';

  clientes: any[] = [];

  constructor(private http: HttpClient, private navController: NavController, private router: Router) {}

  ngOnInit() {
    const hoje = new Date();
    this.dataServico = hoje.toISOString().split('T')[0];

    const nomeUsuario = localStorage.getItem('username');
    this.autorServico = nomeUsuario || '';

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

    const novoServico = {
      dataServico: this.dataServico.trim(),
      horaServico: this.horaServico.trim(),
      status: this.status,
      autorServico: this.autorServico.trim(),
      nomeCliente: this.nomeCliente.trim(),
      telefoneContato: this.telefoneContato.trim(),
      marcaAparelho: this.marcaAparelho.trim(),
      modeloAparelho: this.modeloAparelho.trim(),
      problemaCliente: this.problemaCliente.trim(),
      solucaoInicial: this.solucaoInicial?.trim() || '',
      valorTotal: this.valorTotal ?? null,
      observacoes: this.observacoes.trim() || 'Sem observações',
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
        alert('Erro ao criar serviço.');
      }
    );
  }

  isFormValid(): boolean {
    return [
      this.dataServico, this.horaServico, this.status, this.autorServico,
      this.nomeCliente, this.telefoneContato, this.marcaAparelho, this.modeloAparelho,
      this.problemaCliente
    ].every(campo => campo !== undefined && campo.trim() !== '') &&
      (this.valorTotal === null || this.valorTotal >= 0);
  }

  goBack() {
    this.navController.back();
  }
}