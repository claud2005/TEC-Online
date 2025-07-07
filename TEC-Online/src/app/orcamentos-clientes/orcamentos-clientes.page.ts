import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastController, AlertController, IonicModule } from '@ionic/angular';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import jsPDF from 'jspdf';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-orcamentos-clientes',
  templateUrl: './orcamentos-clientes.page.html',
  styleUrls: ['./orcamentos-clientes.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class OrcamentosClientesPage implements OnInit {
  cliente: any = null;
  servicos: any[] = [];
  token: string = '';

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController
  ) {}

  ngOnInit() {
    this.token = localStorage.getItem('token') || '';

    const clienteId = this.route.snapshot.paramMap.get('id');
    if (clienteId) {
      this.carregarDados(clienteId);
    }
  }

  carregarDados(clienteId: string) {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);

    this.http.get<any>(`/api/clientes/${clienteId}`, { headers }).subscribe({
      next: (res) => {
        this.cliente = res.cliente;
        this.servicos = res.servicos.map((s: any) => ({ ...s, selecionado: false }));
      },
      error: async () => {
        await this.showAlert('Erro ao carregar dados do cliente.');
      }
    });
  }

  formatCurrency(valor: number): string {
    if (valor == null) return '€ 0.00';
    return `€ ${valor.toFixed(2)}`;
  }

  trackById(index: number, item: any): string {
    return (item.id || item._id || index.toString()).toString();
  }

  async gerarPDFSelecionados() {
    const selecionados = this.servicos.filter(s => s.selecionado);
    if (selecionados.length === 0) {
      await this.showAlert('Selecione pelo menos um serviço para gerar o PDF.');
      return;
    }

    const doc = new jsPDF({ unit: 'mm', format: 'a4' });

    for (let i = 0; i < selecionados.length; i++) {
      const servico = selecionados[i];
      if (i > 0) doc.addPage();
      await this.gerarPaginaPDF(servico, doc, i + 1, selecionados.length);
    }

    const dataHoje = new Date().toISOString().slice(0, 10);
    doc.save(`Servicos_Selecionados_${dataHoje}.pdf`);
  }

  private async gerarPaginaPDF(servico: any, doc: jsPDF, paginaAtual: number, totalPaginas: number) {
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

    const addMultilineText = (text: string, x: number, y: number, maxWidth: number, lh: number) => {
      const splitText = doc.splitTextToSize(text, maxWidth);
      doc.text(splitText, x, y);
      return splitText.length * lh;
    };

    const printLabelValue = (label: string, value: string, indent = 0) => {
      const labelWidth = 40;
      const valueX = leftMargin + labelWidth + indent;
      const valueWidth = contentWidth - labelWidth - indent;

      doc.setFont('helvetica', 'bold');
      doc.setTextColor(secondaryColor);
      doc.text(`${label}:`, leftMargin + indent, verticalPos);

      doc.setFont('helvetica', 'normal');
      doc.setTextColor('#444');
      const heightUsed = addMultilineText(value || 'Não informado', valueX, verticalPos, valueWidth, lineHeight - 1);
      verticalPos += Math.max(lineHeight, heightUsed);
    };

    // Cabeçalho com logo e nome da empresa
    try {
      const imgData = await this.getBase64ImageFromAssets('assets/icon/logotipo.png');
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = imgData;

      await new Promise<void>((resolve) => {
        img.onload = () => {
          const targetWidth = 25;
          const aspectRatio = img.height / img.width;
          const targetHeight = targetWidth * aspectRatio;

          doc.addImage(imgData, 'PNG', leftMargin, 10, targetWidth, targetHeight);
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(14);
          doc.setTextColor(primaryColor);
          doc.text(empresaNome, leftMargin + targetWidth + 5, 20);
          resolve();
        };
      });
    } catch {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(16);
      doc.setTextColor(primaryColor);
      doc.text(empresaNome, leftMargin, 18);
    }

    verticalPos += 30;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.setTextColor(secondaryColor);
    doc.text('RELATÓRIO DE SERVIÇO', pageWidth / 2, verticalPos, { align: 'center' });
    verticalPos += lineHeight + 2;

    doc.setFontSize(10);
    doc.setTextColor('#666');
    doc.text(`Nº: ${servico.numero || servico._id || '---'}`, leftMargin, verticalPos);
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

    printLabelValue('Nome', this.cliente?.nomeCompleto || this.cliente?.nome || 'Não informado');
    printLabelValue('Contato', this.cliente?.telefone || this.cliente?.email || 'Não informado');
    verticalPos += 2;

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(primaryColor);
    doc.text('DADOS DO APARELHO', leftMargin, verticalPos);
    verticalPos += lineHeight;

    doc.setFillColor(lightColor);
    doc.rect(leftMargin, verticalPos - 3, contentWidth, lineHeight + 4, 'F');

    printLabelValue('Marca', servico.marcaAparelho || 'Não informado');
    printLabelValue('Modelo', servico.modeloAparelho || 'Não informado');
    verticalPos += 2;

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(primaryColor);
    doc.text('DESCRIÇÃO DO SERVIÇO', leftMargin, verticalPos);
    verticalPos += lineHeight;

    doc.setFillColor(lightColor);
    doc.rect(leftMargin, verticalPos - 3, contentWidth, lineHeight + 4, 'F');

    printLabelValue('Problema relatado', servico.problemaRelatado || 'Não informado');
    printLabelValue('Solução aplicada', servico.solucaoInicial || 'Não informado');
    printLabelValue('Observações', servico.observacoes || 'Não informado');
    verticalPos += 2;

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(primaryColor);
    doc.text('INFORMAÇÕES FINANCEIRAS', leftMargin, verticalPos);
    verticalPos += lineHeight;

    doc.setFillColor(lightColor);
    doc.rect(leftMargin, verticalPos - 3, contentWidth, lineHeight + 4, 'F');

    printLabelValue('Custo estimado', servico.custoEstimado ? `€ ${Number(servico.custoEstimado).toFixed(2)}` : 'Não informado');
    printLabelValue('Valor total', servico.valorTotal ? `€ ${Number(servico.valorTotal).toFixed(2)}` : 'Não informado');
    verticalPos += 2;

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(primaryColor);
    doc.text('RESPONSÁVEL', leftMargin, verticalPos);
    verticalPos += lineHeight;

    doc.setFillColor(lightColor);
    doc.rect(leftMargin, verticalPos - 3, contentWidth, lineHeight + 4, 'F');

    printLabelValue('Técnico', servico.responsavel || 'Não informado');
    if (servico.dataConclusao) {
      const dataFormatada = new Date(servico.dataConclusao).toLocaleDateString();
      printLabelValue('Data conclusão', dataFormatada);
    }

    // Rodapé
    doc.setDrawColor(primaryColor);
    doc.setLineWidth(0.3);
    doc.line(leftMargin, pageHeight - 20, pageWidth - rightMargin, pageHeight - 20);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor('#666');

    doc.text(empresaNome, pageWidth / 2, pageHeight - 15, { align: 'center' });
    doc.text(`Email: ${empresaEmail} | Tel: ${empresaTelefone}`, pageWidth / 2, pageHeight - 10, { align: 'center' });

    doc.text(`Página ${paginaAtual} de ${totalPaginas}`, pageWidth - rightMargin, pageHeight - 10, { align: 'right' });
  }

  private getBase64ImageFromAssets(url: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = url;

      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return reject('Canvas context not available');
        ctx.drawImage(img, 0, 0);
        const dataURL = canvas.toDataURL('image/png');
        resolve(dataURL);
      };

      img.onerror = () => reject('Erro ao carregar imagem');
    });
  }

  async showAlert(message: string) {
    const alert = await this.alertCtrl.create({
      header: 'Aviso',
      message,
      buttons: ['OK']
    });
    await alert.present();
  }
}
