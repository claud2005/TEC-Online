import { Component, OnInit } from '@angular/core';
import { AlertController, NavController } from '@ionic/angular';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Importa o serviço
import { ClienteService } from '../services/cliente.service';

@Component({
  selector: 'app-gestor-clientes',
  templateUrl: './gestor-clientes.page.html',
  styleUrls: ['./gestor-clientes.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
})
export class GestorClientesPage implements OnInit {
  filtro: string = '';
  clientes: any[] = [];
  clientesFiltrados: any[] = [];

  constructor(
    private alertController: AlertController,
    private navCtrl: NavController,
    private clienteService: ClienteService
  ) {}

  ngOnInit() {
    this.carregarClientes();
  }

  carregarClientes() {
    this.clienteService.obterClientes().subscribe(
      (data: any[]) => {
        this.clientes = data;
        this.clientesFiltrados = data;
      },
      (error: any) => {
        this.showAlert('Erro', 'Não foi possível carregar os clientes.');
        console.error(error);
      }
    );
  }

  voltar() {
    this.navCtrl.back();
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
    this.navCtrl.navigateForward(`/editar-cliente/${cliente._id}`);
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
            this.clienteService.deletarCliente(cliente._id).subscribe({
              next: () => {
                this.clientes = this.clientes.filter(c => c._id !== cliente._id);
                this.filtrarClientes();
                this.showAlert('Sucesso', 'Cliente excluído com sucesso!');
              },
              error: (err) => {
                this.showAlert('Erro', 'Falha ao excluir o cliente.');
                console.error(err);
              }
            });
          },
        },
      ],
    });

    await alert.present();
  }

  verOrcamentos(cliente: any) {
    this.navCtrl.navigateForward(`/orcamentos-clientes/${cliente._id}`);
  }

  private async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK'],
    });
    await alert.present();
  }
}
