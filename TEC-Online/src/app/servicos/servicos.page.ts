import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
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
  servicos: Servico[] = [
    {
      numero: '001',
      data: '10/01/2024',
      status: 'ABERTA',
      cliente: 'João Silva',
      descricao: 'Manutenção geral',
      responsavel: 'Técnico A',
      observacoes: 'Troca de peça',
      expandido: false,
      autorServico: 'Técnico A',
      nomeCompletoCliente: 'João Silva dos Santos',
      codigoPostalCliente: '2205-649',
      contatoCliente: '(+351) 999111555',
      modeloAparelho: 'Modelo XYZ',
      marcaAparelho: 'Marca ABC',
      corAparelho: 'Preto',
      problemaRelatado: 'Aparelho com falha na tela, não liga',
      solucaoInicial: 'Substituição da tela e verificação de circuito interno',
      valorTotal: '€ 300,00',
    },
    {
      numero: '002',
      data: '12/01/2024',
      status: 'FECHADA',
      cliente: 'Maria Souza',
      descricao: 'Troca de tela',
      responsavel: 'Técnico B',
      observacoes: 'Finalizado',
      expandido: false,
      autorServico: 'Técnico B',
      nomeCompletoCliente: 'Maria Souza Silva',
      codigoPostalCliente: '9865-432',
      contatoCliente: '(+351) 888555333',
      modeloAparelho: 'Modelo ABC',
      marcaAparelho: 'Marca XYZ',
      corAparelho: 'Branco',
      problemaRelatado: 'Tela rachada e com manchas',
      solucaoInicial: 'Substituição da tela e calibração de cores',
      valorTotal: '€ 250,00',
    },
    {
      numero: '003',
      data: '15/01/2024',
      status: 'ABERTA',
      cliente: 'Carlos Pereira',
      descricao: 'Limpeza e ajuste',
      responsavel: 'Técnico C',
      observacoes: 'Peças OK',
      expandido: false,
      autorServico: 'Técnico C',
      nomeCompletoCliente: 'Carlos Pereira Lima',
      codigoPostalCliente: '6542-123',
      contatoCliente: '(+351) 222444888',
      modeloAparelho: 'Modelo 123',
      marcaAparelho: 'Marca DEF',
      corAparelho: 'Azul',
      problemaRelatado: 'Aparelho sujo e com falha de performance',
      solucaoInicial: 'Limpeza interna e atualização de software',
      valorTotal: '€ 150,00',
    },
  ];

  filtroStatus: string = 'todos';
  searchTerm: string = '';
  servicosFiltrados: Servico[] = [...this.servicos];

  constructor(private router: Router, private alertController: AlertController) {
    this.filtrarServicos();
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
