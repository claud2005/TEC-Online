import { Component, OnInit } from '@angular/core';
import { AlertController, NavController } from '@ionic/angular';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
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
    const token = localStorage.getItem('token');
    console.log('🔐 Token JWT encontrado:', token);

    if (!token || token === 'null' || token === 'undefined') {
      this.showAlert('Erro de autenticação', 'Você precisa estar autenticado para visualizar os clientes.');
      return;
    }

    console.log('📡 Tentando carregar clientes do backend...');
    this.clienteService.obterClientes().subscribe({
      next: (dados) => {
        console.log('✅ Clientes recebidos do backend:', dados);
        this.clientes = dados;
        this.clientesFiltrados = [...this.clientes];
      },
      error: (erro) => {
        console.error('❌ Erro ao carregar clientes:', erro);
        console.error('➡️ Status:', erro.status);
        console.error('📨 Corpo do erro:', erro.error);
        const mensagem = erro?.error?.message || erro.message || 'Erro desconhecido ao buscar clientes.';
        this.showAlert('Erro', `Não foi possível carregar os clientes. ${mensagem}`);
      }
    });
  }

  adicionarCliente() {
    this.navCtrl.navigateForward('/adicionar-cliente');
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
            this.filtrarClientes();
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
}
