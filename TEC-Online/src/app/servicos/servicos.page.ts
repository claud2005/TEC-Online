import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http'; // Importe HttpClient e HttpHeaders
import jsPDF from 'jspdf'; // Importação do jsPDF

interface Servico {
  numero: string;
  data: string;
  status: string;
  cliente: string;
  descricao: string;
  responsavel: string;
  observacoes: string;
  expandido: boolean;
  autorServico: string; // Autor do Serviço
  nomeCompletoCliente: string; // Nome Completo do Cliente
  codigoPostalCliente: string; // Código Postal do Cliente
  contatoCliente: string; // Contacto do Cliente
  modeloAparelho: string; // Modelo do Aparelho
  marcaAparelho: string; // Marca do Aparelho
  corAparelho: string; // Cor do Aparelho
  problemaRelatado: string; // Problema Relatado pelo Cliente
  solucaoInicial: string; // Solução Inicial
  valorTotal: string; // Valor Total
  dataConclusao?: string; // Data de Conclusão
  custoEstimado?: string; // Custo Estimado
}

@Component({
  selector: 'app-servicos',
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule],
  templateUrl: './servicos.page.html',
  styleUrls: ['./servicos.page.scss'],
})
export class ServicosPage {
  servicos: Servico[] = []; // Array para armazenar os serviços
  filtroStatus: string = 'todos';
  searchTerm: string = '';
  servicosFiltrados: Servico[] = [];

  constructor(
    private router: Router,
    private alertController: AlertController,
    private http: HttpClient // Injete o HttpClient
  ) {}

  // Método para carregar os serviços do backend
  carregarServicos() {
    // Obtenha o token do localStorage
    const token = localStorage.getItem('token');

    // Adicione o token no cabeçalho da requisição
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    // Faz a requisição para obter a lista de serviços
    this.http.get<Servico[]>('http://localhost:3000/api/servicos', { headers }).subscribe(
      (response) => {
        this.servicos = response; // Armazena os serviços no array
        this.filtrarServicos(); // Filtra os serviços após carregar
        console.log('Serviços carregados:', this.servicos);
      },
      (error) => {
        console.error('Erro ao carregar serviços:', error);
        alert('Erro ao carregar serviços.');
      }
    );
  }

  // Método chamado quando a página é carregada
  ionViewWillEnter() {
    this.carregarServicos(); // Carrega os serviços ao entrar na página
  }

  // Método para filtrar serviços com base no status e no termo de pesquisa
  filtrarServicos() {
    this.servicosFiltrados = this.servicos.filter(servico => {
      const matchStatus = this.filtroStatus === 'todos' || servico.status === this.filtroStatus;
      const matchSearch = servico.cliente.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                          servico.descricao.toLowerCase().includes(this.searchTerm.toLowerCase());
      return matchStatus && matchSearch;
    });
  }

  // Alterna a visualização dos detalhes do serviço
  toggleDetalhes(servico: Servico) {
    servico.expandido = !servico.expandido;
  }

  // Navega para a página do plano semanal
  voltarParaPlanoSemanal() {
    this.router.navigate(['/plano-semanal']);
  }

  // Gera um PDF com todos os detalhes do serviço
  gerarPDF(servico: Servico) {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('Detalhes do Serviço', 10, 10);
    doc.setFontSize(12);

    doc.text(`Número: ${servico.numero}`, 10, 20);
    doc.text(`Cliente: ${servico.nomeCompletoCliente}`, 10, 30);
    doc.text(`Código Postal: ${servico.codigoPostalCliente}`, 10, 40);
    doc.text(`Contacto: ${servico.contatoCliente}`, 10, 50);
    doc.text(`Modelo do Aparelho: ${servico.modeloAparelho}`, 10, 60);
    doc.text(`Marca do Aparelho: ${servico.marcaAparelho}`, 10, 70);
    doc.text(`Cor do Aparelho: ${servico.corAparelho}`, 10, 80);
    doc.text(`Problema Relatado: ${servico.problemaRelatado}`, 10, 90);
    doc.text(`Solução Inicial: ${servico.solucaoInicial}`, 10, 100);
    doc.text(`Valor Total: ${servico.valorTotal}`, 10, 110);
    doc.text(`Descrição: ${servico.descricao}`, 10, 120);
    doc.text(`Responsável: ${servico.responsavel}`, 10, 130);
    doc.text(`Observações: ${servico.observacoes}`, 10, 140);

    if (servico.dataConclusao) doc.text(`Data de Conclusão: ${servico.dataConclusao}`, 10, 150);
    if (servico.custoEstimado) doc.text(`Custo Estimado: ${servico.custoEstimado}`, 10, 160);

    doc.save(`Servico_${servico.numero}.pdf`);
  }

  // Exibe um alerta para confirmar a exclusão de um serviço
  async confirmarExclusao(servico: Servico) {
    const alert = await this.alertController.create({
      header: 'Confirmar Exclusão',
      message: `Tem a certeza de que deseja apagar o serviço ${servico.numero}?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Confirmar',
          handler: () => this.apagarServico(servico),
        },
      ],
    });

    await alert.present();
  }

  // Apaga o serviço da lista e atualiza os serviços filtrados
  apagarServico(servico: Servico) {
    this.servicos = this.servicos.filter(s => s !== servico);
    this.filtrarServicos();
  }

  // Navega para a página de edição de serviço
  editarServico(servico: Servico) {
    this.router.navigate(['/editar-servicos', servico.numero]); // Passando o número como parâmetro
  }
}