import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http'; // Importe HttpHeaders aqui
import { NavController, IonicModule } from '@ionic/angular';

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
export class CriarServicosPage {
  // Declaração das variáveis do formulário
  dataServico: string = '';
  horaServico: string = '';
  status: string = 'aberto';
  autorServico: string = '';
  nomeCliente: string = '';
  telefoneContato: string = '';
  marcaAparelho: string = '';
  modeloAparelho: string = '';
  corAparelho: string = '';
  problemaCliente: string = '';
  solucaoInicial: string = '';
  valorTotal: number | null = null;
  observacoes: string = '';

  constructor(private http: HttpClient, private navController: NavController) {}

  // Função para salvar o serviço
  salvarServico() {
    // Verifica se o formulário é válido
    if (!this.isFormValid()) {
      alert('Preencha todos os campos obrigatórios.');
      return;
    }

    // Cria um objeto com os dados do novo serviço
    const novoServico = {
      dataServico: this.dataServico.trim(),
      horaServico: this.horaServico.trim(),
      status: this.status,
      autorServico: this.autorServico.trim(),
      nomeCliente: this.nomeCliente.trim(),
      telefoneContato: this.telefoneContato.trim(),
      marcaAparelho: this.marcaAparelho.trim(),
      modeloAparelho: this.modeloAparelho.trim(),
      corAparelho: this.corAparelho.trim(),
      problemaCliente: this.problemaCliente.trim(),
      solucaoInicial: this.solucaoInicial.trim(),
      valorTotal: this.valorTotal ?? 0,
      observacoes: this.observacoes.trim() || 'Sem observações',
    };

    console.log('Dados enviados:', novoServico); // Log para verificar os dados enviados

    // Obtenha o token do localStorage
    const token = localStorage.getItem('token');

    // Adicione o token no cabeçalho da requisição
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    // Realiza a requisição HTTP para salvar o novo serviço
    this.http.post('http://localhost:3000/api/servicos', novoServico, { headers }).subscribe(
      (response) => {
        console.log('Serviço criado:', response);
        alert('Serviço criado com sucesso!');
        this.navController.back(); // Volta para a tela anterior após sucesso
      },
      (error) => {
        console.error('Erro ao criar serviço:', error);
        alert('Erro ao criar serviço.');
      }
    );
  }

  // Função para validar o formulário
  isFormValid(): boolean {
    return [
      this.dataServico, this.horaServico, this.status, this.autorServico,
      this.nomeCliente, this.telefoneContato, this.marcaAparelho, this.modeloAparelho,
      this.corAparelho, this.problemaCliente, this.solucaoInicial
    ].every(campo => campo !== undefined && campo.trim() !== '') && 
      this.valorTotal !== null && this.valorTotal >= 0;
  }

  // Função para voltar para a tela anterior
  goBack() {
    this.navController.back();
  }
}