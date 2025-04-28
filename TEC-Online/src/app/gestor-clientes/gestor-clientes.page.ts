import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AlertController, NavController } from '@ionic/angular';

@Component({
  selector: 'app-gestor-clientes',
  templateUrl: './gestor-clientes.page.html',
  styleUrls: ['./gestor-clientes.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class GestorClientesPage implements OnInit {
  filtro: string = '';
  clientes: any[] = [];
  clientesFiltrados: any[] = [];

  constructor(
    private alertController: AlertController,
    private navCtrl: NavController
  ) {}

  ngOnInit() {
    this.carregarClientes();
  }

  // Carrega clientes localmente (pode simular dados fixos aqui se quiser)
  carregarClientes() {
    // Simulando clientes locais
    this.clientes = [
      { id: 1, nome: 'Cliente 1', email: 'cliente1@email.com' },
      { id: 2, nome: 'Cliente 2', email: 'cliente2@email.com' }
    ];
    this.clientesFiltrados = this.clientes;
  }

  adicionarCliente() {
    this.navCtrl.navigateForward('/adicionar-cliente');
  }

  filtrarClientes() {
    const termo = this.filtro.toLowerCase();
    this.clientesFiltrados = this.clientes.filter(cliente =>
      Object.values(cliente).some(valor =>
        String(valor).toLowerCase().includes(termo)
      )
    );
  }

  editarCliente(cliente: any) {
    console.log('Editar cliente:', cliente);
    this.navCtrl.navigateForward(`/editar-cliente/${cliente.id}`);
  }

  excluirCliente(cliente: any) {
    this.confirmarExclusao(cliente);
  }

  async confirmarExclusao(cliente: any) {
    const alert = await this.alertController.create({
      header: 'Confirmar Exclusão',
      message: `Tem certeza que deseja excluir o cliente ${cliente.nome}?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Excluir',
          handler: () => {
            this.clientes = this.clientes.filter(c => c.id !== cliente.id);
            this.clientesFiltrados = this.clientes;
            this.showAlert('Sucesso', 'Cliente excluído com sucesso!');
          },
        },
      ],
    });

    await alert.present();
  }

  private async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK'],
    });
    await alert.present();
  }

  voltar() {
    this.navCtrl.back();
  }
}
