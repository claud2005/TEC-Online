import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import jsPDF from 'jspdf';
import { environment } from 'src/environments/environment';

interface Servico {
  numero: string;
  data: string;
  status: string;
  cliente: string;
  descricao: string;
  responsavel: string;
  observacoes: string;
  expandido: boolean;
  autorServico: string;
  nomeCompletoCliente: string;
  contatoCliente: string;
  modeloAparelho: string;
  marcaAparelho: string;
  problemaRelatado: string;
  solucaoInicial: string;
  valorTotal: string;
  dataConclusao?: string;
  custoEstimado?: string;
}

@Component({
  selector: 'app-servicos',
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule],
  templateUrl: './servicos.page.html',
  styleUrls: ['./servicos.page.scss'],
})
export class ServicosPage implements OnInit {
  servicos: Servico[] = [];
  filtroStatus: string = 'todos';
  searchTerm: string = '';
  servicosFiltrados: Servico[] = [];

  constructor(
    private router: Router,
    private alertController: AlertController,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.carregarServicos();
  }

  formatarData(data: string): string {
    const date = new Date(data);
    if (isNaN(date.getTime())) {
      return 'Data inválida';
    }
    if (data.includes('T')) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      return `${year}-${month}-${day} ${hours}:${minutes}`;
    } else {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day} 00:00`;
    }
  }

  formatarIdServico(id: string): string {
    return id.padStart(3, '0');
  }

  carregarServicos() {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.get<Servico[]>(`${environment.api_url}/api/servicos`, { headers }).subscribe(
      (response) => {
        console.log('Serviços recebidos da API:', response);
        this.servicos = response.map((servico, index) => ({
          ...servico,
          numero: this.formatarIdServico((index + 1).toString()),
          data: this.formatarData(servico.data)
        }));
        this.filtrarServicos();
        console.log('Serviços carregados:', this.servicos);
      },
      (error) => {
        console.error('Erro ao carregar serviços:', error);
        alert('Erro ao carregar serviços.');
      }
    );
  }

  gerarPDF(servico: Servico) {
  const doc = new jsPDF({
    unit: 'mm',
    format: 'a4',
  });

  const leftMargin = 15;
  let verticalPos = 20;
  const lineHeight = 8;
  const pageWidth = doc.internal.pageSize.getWidth();

  // Função auxiliar para quebrar texto longo
  function addMultilineText(text: string, x: number, y: number, maxWidth: number) {
    const splitText = doc.splitTextToSize(text, maxWidth);
    doc.text(splitText, x, y);
    return splitText.length * lineHeight;
  }

  // Cabeçalho com título
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.setTextColor('#007aff');
  doc.text('Detalhes do Serviço', pageWidth / 2, verticalPos, { align: 'center' });
  verticalPos += lineHeight + 4;

  // Linha horizontal decorativa
  doc.setDrawColor('#007aff');
  doc.setLineWidth(0.7);
  doc.line(leftMargin, verticalPos, pageWidth - leftMargin, verticalPos);
  verticalPos += 6;

  // Conteúdo - título e valores
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor('#333');

  // Helper para imprimir label + valor formatado
  function printLabelValue(label: string, value: string) {
    doc.text(label + ':', leftMargin, verticalPos);
    const valueWidth = pageWidth - leftMargin * 2 - 40;
    doc.setFont('helvetica', 'normal');
    verticalPos += addMultilineText(value, leftMargin + 40, verticalPos - lineHeight, valueWidth);
    doc.setFont('helvetica', 'bold');
  }

  printLabelValue('Número', servico.numero);
  printLabelValue('Cliente', servico.nomeCompletoCliente);
  printLabelValue('Contato', servico.contatoCliente);
  printLabelValue('Modelo do Aparelho', servico.modeloAparelho);
  printLabelValue('Marca do Aparelho', servico.marcaAparelho);
  printLabelValue('Problema Relatado', servico.problemaRelatado);
  printLabelValue('Solução Inicial', servico.solucaoInicial);
  printLabelValue('Valor Total', `€ ${parseFloat(servico.valorTotal).toFixed(2)}`);
  printLabelValue('Descrição', servico.descricao);
  printLabelValue('Responsável', servico.responsavel);
  printLabelValue('Observações', servico.observacoes);

  if (servico.dataConclusao) printLabelValue('Data de Conclusão', servico.dataConclusao);
  if (servico.custoEstimado) printLabelValue('Custo Estimado', `€ ${parseFloat(servico.custoEstimado).toFixed(2)}`);

  // Rodapé com paginação e data atual
  const pageHeight = doc.internal.pageSize.getHeight();
  doc.setFontSize(10);
  doc.setTextColor('#666');
  const now = new Date().toLocaleString();
  doc.text(`Gerado em: ${now}`, leftMargin, pageHeight - 10);
  doc.text(`Página 1`, pageWidth - leftMargin, pageHeight - 10, { align: 'right' });

  // Salvar o PDF
  doc.save(`Servico_${servico.numero}.pdf`);
}


  filtrarServicos() {
    this.servicosFiltrados = this.servicos.filter(servico => {
      const matchStatus = this.filtroStatus === 'todos' || servico.status === this.filtroStatus;
      const matchSearch = servico.cliente.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                          servico.descricao.toLowerCase().includes(this.searchTerm.toLowerCase());
      return matchStatus && matchSearch;
    });
  }

  voltarParaPlanoSemanal() {
    this.router.navigate(['/plano-semanal']);
  }

  toggleDetalhes(servico: Servico) {
    servico.expandido = !servico.expandido;
  }

  editarServico(servico: any) {
    console.log("ID do serviço sendo passado:", servico._id);
    this.router.navigate(['/editar-servicos', servico._id]);
  }
}
