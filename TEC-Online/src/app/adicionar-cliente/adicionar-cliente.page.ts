import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule, NavController } from '@ionic/angular';

@Component({
  selector: 'app-adicionar-cliente',
  templateUrl: './adicionar-cliente.page.html',
  styleUrls: ['./adicionar-cliente.page.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule],
})
export class AdicionarClientePage {
  cliente = {
    nome: '',
    tipoPessoa: '',
    nif: '',
    contato: '',
    nomeContato: '',
    email: '',
    codigoPostal: '',
    cidade: '',
    endereco: '',
    numeroCliente: 0,
    observacoes: ''
  };

  numeroClienteAutomatico = 12345;

  constructor(
    private navCtrl: NavController
  ) {}

  // Função para salvar cliente
  salvarCliente() {
    this.cliente.numeroCliente = this.numeroClienteAutomatico;

    console.log('Cliente salvo (simulado):', this.cliente);
    alert('Cliente salvo com sucesso! (Simulado)');
    this.numeroClienteAutomatico++;
    this.voltar();
  }

  // Função para voltar à página anterior
  voltar() {
    this.navCtrl.back();
  }
}
