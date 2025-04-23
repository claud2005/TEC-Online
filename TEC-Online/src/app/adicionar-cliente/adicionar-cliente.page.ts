import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule, NavController } from '@ionic/angular'; // <-- IMPORTA AQUI

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
    numeroCliente: '',
    observacoes: ''
  };

  numeroClienteAutomatico = 12345;

  // ✅ INJETA O NAVCONTROLLER NO CONSTRUTOR
  constructor(private navCtrl: NavController) {}

  salvarCliente() {
    // lógica de salvar cliente
  }

  voltar() {
    this.navCtrl.back(); // Agora isso funciona
  }
}
