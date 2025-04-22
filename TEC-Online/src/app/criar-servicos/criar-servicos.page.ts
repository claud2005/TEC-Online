import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { NavController, IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';

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
  nomeCliente: string = '';
  telefoneContato: string = '';
  marcaAparelho: string = '';
  modeloAparelho: string = '';
  problemaCliente: string = '';
  solucaoInicial: string = '';
  valorTotal: number | null = null;
  observacoes: string = '';

  constructor(private http: HttpClient, private navController: NavController, private router: Router) {}

  ngOnInit() {
    const hoje = new Date();
    this.dataServico = hoje.toISOString().split('T')[0];

    const nomeUsuario = localStorage.getItem('username');
    this.autorServico = nomeUsuario || '';
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
      solucaoInicial: this.solucaoInicial.trim(),
      valorTotal: this.valorTotal ?? 0,
      observacoes: this.observacoes.trim() || 'Sem observações',
    };

    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.post('http://localhost:3000/api/servicos', novoServico, { headers }).subscribe(
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
      this.problemaCliente, this.solucaoInicial
    ].every(campo => campo !== undefined && campo.trim() !== '') &&
      this.valorTotal !== null && this.valorTotal >= 0;
  }

  goBack() {
    this.navController.back();
  }
}