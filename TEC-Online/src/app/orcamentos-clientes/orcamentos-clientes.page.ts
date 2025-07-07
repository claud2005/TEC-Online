import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AlertController, IonicModule } from '@ionic/angular';
import { environment } from '../../environments/environment';
import jsPDF from 'jspdf';

interface Servico {
  _id: string;
  numero: string;
  nomeCompletoCliente: string;
  contatoCliente: string;
  marcaAparelho: string;
  modeloAparelho: string;
  problemaRelatado: string;
  solucaoInicial: string;
  observacoes: string;
  custoEstimado: string;
  valorTotal: string;
  responsavel: string;
  dataConclusao?: string;
  status: 'Pendente' | 'Concluído' | 'Cancelado';
}

@Component({
  selector: 'app-orcamentos-clientes',
  templateUrl: './orcamentos-clientes.page.html',
  styleUrls: ['./orcamentos-clientes.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonicModule
  ]
})
export class OrcamentosClientesPage implements OnInit {
  cliente: any = null;
  servicos: Servico[] = [];
  isLoading = true;
  errorMessage: string | null = null;
  servicoSelecionado: { [key: string]: boolean } = {};

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    const clienteId = this.route.snapshot.paramMap.get('id');
    if (clienteId) {
      this.carregarDadosCliente(clienteId);
    } else {
      this.handleError('ID do cliente não encontrado na URL');
    }
  }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    if (!token) {
      this.handleError('Autenticação necessária - Token não encontrado');
      throw new Error('Token não disponível');
    }
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  carregarDadosCliente(clienteId: string): void {
    this.isLoading = true;
    this.errorMessage = null;
    const headers = this.getAuthHeaders();

    this.http.get(`${environment.api_url}/api/clientes/${clienteId}`, { headers }).subscribe({
      next: (cliente: any) => {
        this.cliente = cliente;
        this.carregarServicos(clienteId);
      },
      error: (error) => {
        if (error.status === 404) {
          this.handleError('Cliente não encontrado na base de dados');
        } else {
          this.handleError('Erro ao carregar dados do cliente');
        }
      }
    });
  }

  carregarServicos(clienteId: string): void {
    const headers = this.getAuthHeaders();
    this.http.get(`${environment.api_url}/api/clientes/${clienteId}/orcamentos`, { headers }).subscribe({
      next: (servicos: any) => {
        this.servicos = servicos;
        this.servicos.forEach(s => this.servicoSelecionado[s._id] = false);
        this.isLoading = false;
      },
      error: () => {
        this.handleError('Erro ao carregar serviços do cliente');
        this.isLoading = false;
      }
    });
  }

  private handleError(message: string): void {
    this.errorMessage = message;
    this.isLoading = false;
    this.showAlert(message);
  }

  private async showAlert(message: string) {
    const alert = await this.alertController.create({
      header: 'Aviso',
      message,
      buttons: ['OK']
    });
    await alert.present();
  }

formatCurrency(value: any): string {
  const num = parseFloat(value);
  if (isNaN(num)) return '€0.00';
  return num.toLocaleString('pt-PT', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

formatarNumero(numero: number): string {
  return '#' + numero.toString().padStart(3, '0');
}
  irParaEditarServico(event: Event, servicoId: string) {
    event.stopPropagation();
    this.router.navigate(['/editar-servico', servicoId]);
  }

  async gerarPDFSelecionados() {
    const selecionados = this.servicos.filter(s => this.servicoSelecionado[s._id]);
    if (selecionados.length === 0) {
      this.showAlert('Nenhum serviço selecionado para gerar PDF.');
      return;
    }

    const doc = new jsPDF({ unit: 'mm', format: 'a4' });

    for (let i = 0; i < selecionados.length; i++) {
      const servico = selecionados[i];
      await this.adicionarConteudoServicoPDF(doc, servico, i + 1, selecionados.length);
      if (i < selecionados.length - 1) doc.addPage();
    }

    const data = new Date().toISOString().slice(0, 10);
    doc.save(`Servicos_Selecionados_${data}.pdf`);
  }

  async adicionarConteudoServicoPDF(doc: jsPDF, servico: Servico, paginaAtual: number, totalPaginas: number) {
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
        img.onerror = (err) => reject(err);
      });
    };

    const addLogo = async () => {
      try {
        const imgData = await getBase64ImageFromAssets('assets/icon/logotipo.png');
        const img = new Image();
        img.src = imgData;
        await new Promise<void>((resolve) => {
          img.onload = () => {
            const targetWidth = 25;
            const aspectRatio = img.height / img.width;
            const targetHeight = targetWidth * aspectRatio;
            const xPos = leftMargin;
            const yPos = 10;
            doc.addImage(imgData, 'PNG', xPos, yPos, targetWidth, targetHeight);
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(14);
            doc.setTextColor(primaryColor);
            doc.text(empresaNome, xPos + targetWidth + 5, yPos + targetHeight / 2 + 4);
            resolve();
          };
        });
      } catch (e) {
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

    doc.setDrawColor(primaryColor);
    doc.setLineWidth(0.3);
    doc.line(leftMargin, pageHeight - 20, pageWidth - rightMargin, pageHeight - 20);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor('#666');
    doc.text(empresaNome, pageWidth / 2, pageHeight - 15, { align: 'center' });
    doc.text(`Email: ${empresaEmail}  |  Tel: ${empresaTelefone}`, pageWidth / 2, pageHeight - 11, { align: 'center' });
    doc.text(`Página ${paginaAtual}/${totalPaginas}`, pageWidth - rightMargin, pageHeight - 6, { align: 'right' });
  }
}
