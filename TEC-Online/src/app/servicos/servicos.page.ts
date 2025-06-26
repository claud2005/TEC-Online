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

  async gerarPDF(servico: Servico) {
  const doc = new jsPDF({
    unit: 'mm',
    format: 'a4',
  });

  // Configurações de layout
  const leftMargin = 15;
  const rightMargin = 15;
  let verticalPos = 20;
  const lineHeight = 7;
  const pageWidth = doc.internal.pageSize.getWidth();
  const contentWidth = pageWidth - leftMargin - rightMargin;
  const pageHeight = doc.internal.pageSize.getHeight();

  // Cores da empresa (pode ajustar conforme necessário)
  const primaryColor = '#007aff';
  const secondaryColor = '#333333';
  const lightColor = '#f5f5f5';

  // Função auxiliar para quebrar texto longo
  const addMultilineText = (text: string, x: number, y: number, maxWidth: number, lineHeight: number) => {
    const splitText = doc.splitTextToSize(text, maxWidth);
    doc.text(splitText, x, y);
    return splitText.length * lineHeight;
  };

  // Adicionar logotipo (substitua pela URL/base64 do seu logotipo)
  const addLogo = async () => {
    try {
      const imgData = await this.getBase64ImageFromAssets('logotipo.png');
      doc.addImage(imgData, 'PNG', leftMargin, 10, 30, 10); // Ajuste tamanho conforme necessário
    } catch (e) {
      console.error('Erro ao carregar logotipo:', e);
      // Fallback textual
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(16);
      doc.setTextColor(primaryColor);
      doc.text('RFM-Informatica', leftMargin, 15);
    }
  };
    // Cabeçalho
    // Aguarde o carregamento do logotipo antes de continuar
    await addLogo();
  
    // Título principal 
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.setTextColor(secondaryColor);
    doc.text('RELATÓRIO DE SERVIÇO', pageWidth / 2, verticalPos, { align: 'center' });
    verticalPos += lineHeight + 2;

    // Informações básicas em linha
    doc.setFontSize(10);
    doc.setTextColor('#666');
    doc.text(`Nº: ${servico.numero}`, leftMargin, verticalPos);
    doc.text(`Data: ${new Date().toLocaleDateString()}`, pageWidth - rightMargin, verticalPos, { align: 'right' });
    verticalPos += lineHeight + 4;

    // Linha horizontal decorativa
    doc.setDrawColor(primaryColor);
    doc.setLineWidth(0.5);
    doc.line(leftMargin, verticalPos, pageWidth - rightMargin, verticalPos);
    verticalPos += 8;

    // Seção de Dados do Cliente
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(primaryColor);
    doc.text('DADOS DO CLIENTE', leftMargin, verticalPos);
    verticalPos += lineHeight;

    // Fundo para seção
    doc.setFillColor(lightColor);
    doc.rect(leftMargin, verticalPos - 3, contentWidth, lineHeight + 4, 'F');
  
    // Helper para imprimir label + valor formatado
    const printLabelValue = (label: string, value: string, indent = 0) => {
      const labelWidth = 40;
      const valueX = leftMargin + labelWidth + indent;
      const valueWidth = contentWidth - labelWidth - indent;
    
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(secondaryColor);
      doc.text(`${label}:`, leftMargin + indent, verticalPos);
    
      doc.setFont('helvetica', 'normal');
      doc.setTextColor('#444');
      const lines = addMultilineText(value || 'Não informado', valueX, verticalPos, valueWidth, lineHeight - 1);
      verticalPos += Math.max(lineHeight, lines);
    };

    // Dados do cliente
    printLabelValue('Nome', servico.nomeCompletoCliente);
    printLabelValue('Contato', servico.contatoCliente);
    verticalPos += 2;

    // Seção de Dados do Aparelho
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(primaryColor);
    doc.text('DADOS DO APARELHO', leftMargin, verticalPos);
    verticalPos += lineHeight;

    doc.setFillColor(lightColor);
    doc.rect(leftMargin, verticalPos - 3, contentWidth, lineHeight + 4, 'F');
  
    printLabelValue('Marca', servico.marcaAparelho);
    printLabelValue('Modelo', servico.modeloAparelho);
    verticalPos += 2;

    // Seção de Descrição do Serviço
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(primaryColor);
    doc.text('DESCRIÇÃO DO SERVIÇO', leftMargin, verticalPos);
    verticalPos += lineHeight;

    doc.setFillColor(lightColor);
    doc.rect(leftMargin, verticalPos - 3, contentWidth, lineHeight + 4, 'F');
  
    printLabelValue('Problema relatado', servico.problemaRelatado);
    printLabelValue('Solução aplicada', servico.solucaoInicial);
    printLabelValue('Observações', servico.observacoes);
    verticalPos += 2;

    // Seção Financeira
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(primaryColor);
    doc.text('INFORMAÇÕES FINANCEIRAS', leftMargin, verticalPos);
    verticalPos += lineHeight;

    doc.setFillColor(lightColor);
    doc.rect(leftMargin, verticalPos - 3, contentWidth, lineHeight + 4, 'F');
  
    printLabelValue('Custo estimado', servico.custoEstimado ? `€ ${parseFloat(servico.custoEstimado).toFixed(2)}` : 'Não informado');
    printLabelValue('Valor total', servico.valorTotal ? `€ ${parseFloat(servico.valorTotal).toFixed(2)}` : 'Não informado');
    verticalPos += 2;

    // Seção de Responsável
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(primaryColor);
    doc.text('RESPONSÁVEL', leftMargin, verticalPos);
    verticalPos += lineHeight;

    doc.setFillColor(lightColor);
    doc.rect(leftMargin, verticalPos - 3, contentWidth, lineHeight + 4, 'F');
  
    printLabelValue('Técnico', servico.responsavel);
      if (servico.dataConclusao) {
    printLabelValue('Data conclusão', servico.dataConclusao);
    }
    verticalPos += 10;

    // Rodapé
    doc.setFontSize(10);
    doc.setTextColor('#666');
    doc.setFont('helvetica', 'italic');
  
    // Linha de rodapé
    doc.setDrawColor(primaryColor);
    doc.setLineWidth(0.3);
    doc.line(leftMargin, pageHeight - 20, pageWidth - rightMargin, pageHeight - 20);
  
    // Informações de rodapé
    doc.text('RFM-Informatica', pageWidth / 2, pageHeight - 15, { align: 'center' });
    doc.text(`Documento gerado em: ${new Date().toLocaleString()}`, leftMargin, pageHeight - 10);
    doc.text('Página 1/1', pageWidth - rightMargin, pageHeight - 10, { align: 'right' });

    // Salvar o PDF
    doc.save(`Servico_${servico.numero}_${new Date().toISOString().slice(0,10)}.pdf`);
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
async getBase64ImageFromAssets(imagePath: string): Promise<string> {
  // Ajuste o caminho conforme necessário para o seu projeto Angular/Ionic
  const response = await fetch(`assets/${imagePath}`);
  const blob = await response.blob();
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        // Remove o prefixo "data:*/*;base64," se necessário
        resolve(reader.result.toString());
      } else {
        reject('Erro ao converter imagem para base64');
      }
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}
}

