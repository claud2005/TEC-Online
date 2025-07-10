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
  dataServico: string;
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
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      return `${day}-${month}-${year} ${hours}:${minutes}`;
    } else {
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      return `${day}-${month}-${year} 00:00`;
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
          data: this.formatarData(servico.dataServico),
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

  const leftMargin = 15;
  const rightMargin = 15;
  let verticalPos = 20;
  const lineHeight = 7;
  const pageWidth = doc.internal.pageSize.getWidth();
  const contentWidth = pageWidth - leftMargin - rightMargin;
  const pageHeight = doc.internal.pageSize.getHeight();

  const primaryColor = '#007aff';
  const secondaryColor = '#333333';
  const lightColor = '#f5f5f5';

  const empresaNome = 'RFM-Informatica';
  const empresaEmail = 'rfm@gmail.com';
  const empresaTelefone = '911234567';

  const addMultilineText = (text: string, x: number, y: number, maxWidth: number, lineHeight: number) => {
    const splitText = doc.splitTextToSize(text, maxWidth);
    doc.text(splitText, x, y);
    return splitText.length * lineHeight;
  };

  const getBase64ImageFromAssets = async (path: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = path;
      img.crossOrigin = 'anonymous';

      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return reject('Canvas context não disponível');

        ctx.drawImage(img, 0, 0);
        const dataURL = canvas.toDataURL('image/png');
        resolve(dataURL);
      };

      img.onerror = (err) => {
        reject(err);
      };
    });
  };

  const addLogo = async () => {
    try {
      const imgData = await getBase64ImageFromAssets('assets/icon/logotipo.png');

      const img = new Image();
      img.src = imgData;

      await new Promise<void>((resolve) => {
        img.onload = () => {
          const originalWidth = img.width;
          const originalHeight = img.height;

          const targetWidth = 25;
          const aspectRatio = originalHeight / originalWidth;
          const targetHeight = targetWidth * aspectRatio;

          const xPos = leftMargin;
          const yPos = 10;

          doc.addImage(imgData, 'PNG', xPos, yPos, targetWidth, targetHeight);

          // Nome da empresa ao lado do logo
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(14);
          doc.setTextColor(primaryColor);
          doc.text(empresaNome, xPos + targetWidth + 5, yPos + targetHeight / 2 + 4);

          resolve();
        };
      });
    } catch (e) {
      console.error('Erro ao carregar logotipo:', e);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(16);
      doc.setTextColor(primaryColor);
      doc.text(empresaNome, leftMargin, 18);
    }
  };

  await addLogo();

  verticalPos += 25;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(secondaryColor);
  doc.text('RELATÓRIO DE SERVIÇO', pageWidth / 2, verticalPos, { align: 'center' });
  verticalPos += lineHeight + 2;

  doc.setFontSize(10);
  doc.setTextColor('#666');
  doc.text(`Nº: ${servico.numero}`, leftMargin, verticalPos);
  doc.text(`Data: ${new Date().toLocaleDateString()}`, pageWidth - rightMargin, verticalPos, { align: 'right' });
  verticalPos += lineHeight + 4;

  doc.setDrawColor(primaryColor);
  doc.setLineWidth(0.5);
  doc.line(leftMargin, verticalPos, pageWidth - rightMargin, verticalPos);
  verticalPos += 8;

  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(primaryColor);
  doc.text('DADOS DO CLIENTE', leftMargin, verticalPos);
  verticalPos += lineHeight;

  doc.setFillColor(lightColor);
  doc.rect(leftMargin, verticalPos - 3, contentWidth, lineHeight + 4, 'F');

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

  printLabelValue('Nome', servico.nomeCompletoCliente);
  printLabelValue('Contato', servico.contatoCliente);
  verticalPos += 2;

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(primaryColor);
  doc.text('DADOS DO APARELHO', leftMargin, verticalPos);
  verticalPos += lineHeight;

  doc.setFillColor(lightColor);
  doc.rect(leftMargin, verticalPos - 3, contentWidth, lineHeight + 4, 'F');

  printLabelValue('Marca', servico.marcaAparelho);
  printLabelValue('Modelo', servico.modeloAparelho);
  verticalPos += 2;

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

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(primaryColor);
  doc.text('INFORMAÇÕES FINANCEIRAS', leftMargin, verticalPos);
  verticalPos += lineHeight;

  doc.setFillColor(lightColor);
  doc.rect(leftMargin, verticalPos - 3, contentWidth, lineHeight + 4, 'F');

  printLabelValue('Custo estimado', servico.custoEstimado ? `€ ${parseFloat(servico.custoEstimado).toFixed(2)}` : 'Não informado');
  printLabelValue('Valor total', servico.valorTotal ? `€ ${parseFloat(servico.valorTotal).toFixed(2)}` : 'Não informado');
  verticalPos += 2;

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
  doc.setDrawColor(primaryColor);
  doc.setLineWidth(0.3);
  doc.line(leftMargin, pageHeight - 20, pageWidth - rightMargin, pageHeight - 20);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'italic');
  doc.setTextColor('#666');
  doc.text(empresaNome, pageWidth / 2, pageHeight - 15, { align: 'center' });
  doc.text(`Email: ${empresaEmail}  |  Tel: ${empresaTelefone}`, pageWidth / 2, pageHeight - 11, { align: 'center' });
  doc.text('Página 1/1', pageWidth - rightMargin, pageHeight - 6, { align: 'right' });

  // Salvar
  doc.save(`Servico_${servico.numero}_${new Date().toISOString().slice(0,10)}.pdf`);
}


  filtrarServicos() {
  const termo = this.searchTerm.toLowerCase();

  this.servicosFiltrados = this.servicos.filter(servico => {
    const matchStatus = this.filtroStatus === 'todos' || servico.status.toLowerCase() === this.filtroStatus.toLowerCase();

    const matchSearch =
      servico.numero?.toLowerCase().includes(termo) ||
      servico.nomeCompletoCliente?.toLowerCase().includes(termo) ||
      servico.marcaAparelho?.toLowerCase().includes(termo) ||
      servico.descricao?.toLowerCase().includes(termo);

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

