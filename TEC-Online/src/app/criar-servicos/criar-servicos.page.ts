import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { NavController, IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-criar-servicos',
  standalone: true,
  templateUrl: './criar-servicos.page.html',
  styleUrls: ['./criar-servicos.page.scss'],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
  ],
})
export class CriarServicosPage {
  dataAbertura: string = '';
  dataEntrega: string = '';
  status: string = 'pendente';
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

  constructor(private http: HttpClient, private navController: NavController) {}

  salvarServico() {
    if (!this.isFormValid()) {
      alert('Preencha todos os campos obrigatórios.');
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

    this.http.post('http://localhost:3000/api/servicos', novoServico).subscribe(
      () => {
        alert('Serviço criado com sucesso!');
        this.navController.back();
      },
      () => alert('Erro ao criar serviço.')
    );
  }

  isFormValid(): boolean {
    return [
      this.dataAbertura, this.dataEntrega, this.status, this.nomeCliente,
      this.telefoneContato, this.cpfCliente, this.modeloAparelho, this.marcaAparelho,
      this.corAparelho, this.problemaCliente, this.solucaoInicial, this.autorServico
    ].every(campo => campo && campo.trim() !== '') &&
      this.valorTotal !== null && this.valorTotal >= 0 &&
      this.valorEntrada !== null && this.valorEntrada >= 0;
  }

  goBack() {
    this.navController.back();
  }
}
