import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-criar-servicos',
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule],
  templateUrl: './criar-servicos.page.html',
  styleUrls: ['./criar-servicos.page.scss'],
})
export class CriarServicosPage {
  dataAbertura: string = '';
  dataEntrega: string = '';
  status: string = 'orcamento';
  nomeCliente: string = '';
  telefoneContato: string = '';
  cpfCliente: string = '';
  modeloAparelho: string = '';
  marcaAparelho: string = '';
  corAparelho: string = '';
  problemaCliente: string = '';
  solucaoInicial: string = '';
  valorTotal: number | null = null;
  valorEntrada: number | null = null;
  observacoes: string = '';
  autorServico: string = '';

  constructor() {}

  salvarServico() {
    if (!this.isFormValid()) {
      alert('Por favor, preencha todos os campos obrigatórios antes de salvar.');
      return;
    }

    const novoServico = {
      dataAbertura: this.dataAbertura,
      dataEntrega: this.dataEntrega,
      status: this.status,
      nomeCliente: this.nomeCliente,
      telefoneContato: this.telefoneContato,
      cpfCliente: this.cpfCliente,
      modeloAparelho: this.modeloAparelho,
      marcaAparelho: this.marcaAparelho,
      corAparelho: this.corAparelho,
      problemaCliente: this.problemaCliente,
      solucaoInicial: this.solucaoInicial,
      valorTotal: this.valorTotal ?? 0,
      valorEntrada: this.valorEntrada ?? 0,
      observacoes: this.observacoes.trim() || 'Sem observações',
      autorServico: this.autorServico,
    };

    console.table(novoServico);
    alert('Ordem de serviço criada com sucesso!');
  }

  isFormValid(): boolean {
    const camposObrigatorios = [
      this.dataAbertura,
      this.dataEntrega,
      this.status,
      this.nomeCliente,
      this.telefoneContato,
      this.cpfCliente,
      this.modeloAparelho,
      this.marcaAparelho,
      this.corAparelho,
      this.problemaCliente,
      this.solucaoInicial,
      this.autorServico
    ];

    const valoresObrigatorios = [this.valorTotal, this.valorEntrada];

    return camposObrigatorios.every(campo => campo && campo.trim() !== '') &&
           valoresObrigatorios.every(valor => valor !== null && valor >= 0);
  }
}
