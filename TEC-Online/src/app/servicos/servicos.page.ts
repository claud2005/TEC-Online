import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import jsPDF from 'jspdf'; // Importação do jsPDF

@Component({
  selector: 'app-servicos',
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule],
  templateUrl: './servicos.page.html',
  styleUrls: ['./servicos.page.scss'],
})
export class ServicosPage {
  servicos = [
    { numero: '001', data: '10/01/2024', status: 'ABERTA', cliente: 'João Silva', descricao: 'Manutenção geral', responsavel: 'Técnico A', observacoes: 'Troca de peça', expandido: false },
    { numero: '002', data: '12/01/2024', status: 'FECHADA', cliente: 'Maria Souza', descricao: 'Troca de tela', responsavel: 'Técnico B', observacoes: 'Finalizado', expandido: false },
    { numero: '003', data: '15/01/2024', status: 'ABERTA', cliente: 'Carlos Pereira', descricao: 'Limpeza e ajuste', responsavel: 'Técnico C', observacoes: 'Peças OK', expandido: false },
    { numero: '004', data: '17/01/2024', status: 'FECHADA', cliente: 'Ana Costa', descricao: 'Atualização de software', responsavel: 'Técnico D', observacoes: 'Sem erros', expandido: false },
    { numero: '005', data: '20/01/2024', status: 'ABERTA', cliente: 'Pedro Martins', descricao: 'Reinstalação do sistema', responsavel: 'Técnico E', observacoes: 'Configuração padrão', expandido: false }
  ];

  filtroStatus: string = 'todos';
  searchTerm: string = '';
  servicosFiltrados = [...this.servicos];

  constructor(private router: Router) {
    this.filtrarServicos();
  }

  // Método para filtrar os serviços conforme o status e a busca
  filtrarServicos() {
    this.servicosFiltrados = this.servicos
      .filter(servico => {
        const matchStatus = this.filtroStatus === 'todos' || servico.status === this.filtroStatus;
        const matchSearch = servico.cliente.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                            servico.descricao.toLowerCase().includes(this.searchTerm.toLowerCase());
        return matchStatus && matchSearch;
      })
      .sort((a, b) => new Date(a.data).getTime() - new Date(b.data).getTime()); // Ordena por data
  }

  // Método para exibir ou esconder os detalhes do serviço
  toggleDetalhes(servico: any) {
    servico.expandido = !servico.expandido; // Alterna entre verdadeiro e falso
  }

  // Método para navegar de volta para a página de plano semanal
  voltarParaPlanoSemanal() {
    this.router.navigate(['/plano-semanal']);
  }

  // Método para gerar um PDF com os detalhes do serviço
  gerarPDF(servico: any) {
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
}
