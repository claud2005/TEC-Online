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
    { numero: '001', data: '10/01/2024', status: 'ABERTA', cliente: 'João Silva', descricao: 'Manutenção geral', responsavel: 'Técnico A', observacoes: 'Troca de peça', expandido: false },
    { numero: '002', data: '12/01/2024', status: 'FECHADA', cliente: 'Maria Souza', descricao: 'Troca de tela', responsavel: 'Técnico B', observacoes: 'Finalizado', expandido: false },
    { numero: '003', data: '15/01/2024', status: 'ABERTA', cliente: 'Carlos Pereira', descricao: 'Limpeza e ajuste', responsavel: 'Técnico C', observacoes: 'Peças OK', expandido: false },
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

  // Gera um PDF com os detalhes do serviço
  gerarPDF(servico: Servico) {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('Detalhes do Serviço', 10, 10);
    doc.setFontSize(12);
    doc.text(`Número: ${servico.numero}`, 10, 20);
    doc.text(`Cliente: ${servico.cliente}`, 10, 30);
    doc.text(`Descrição: ${servico.descricao}`, 10, 40);
    doc.text(`Responsável: ${servico.responsavel}`, 10, 50);
    doc.text(`Observações: ${servico.observacoes}`, 10, 60);
    doc.save(`Servico_${servico.numero}.pdf`);
  }

  // Exibe um alerta para confirmar a exclusão de um serviço
  async confirmarExclusao(servico: Servico) {
    const alert = await this.alertController.create({
      header: 'Confirmar Exclusão',
      message: `Tem certeza de que deseja apagar o serviço <strong>${servico.numero}</strong>?`,
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
