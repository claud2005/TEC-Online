import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';  // Importando o IonicModule
import { CommonModule } from '@angular/common';  // Importando o CommonModule
import { FormsModule } from '@angular/forms';    // Importando o FormsModule
import { AlertController } from '@ionic/angular';  // Para mostrar o alerta de confirmação de exclusão

@Component({
  selector: 'app-gestor-clientes',
  templateUrl: './gestor-clientes.page.html',
  styleUrls: ['./gestor-clientes.page.scss'],
  standalone: true,   // Definindo que este é um componente standalone
  imports: [IonicModule, CommonModule, FormsModule]  // Importando o CommonModule e FormsModule para funcionar com ngFor e ngModel
})
export class GestorClientesPage implements OnInit {
  filtro: string = '';  // Filtro para a barra de pesquisa
  clientes: any[] = [];  // Lista de clientes (aqui você pode carregar os dados de uma API ou serviço)
  clientesFiltrados: any[] = [];  // Clientes após o filtro aplicado

  constructor(private alertController: AlertController) {}

  ngOnInit() {
    this.carregarClientes();  // Carregar os clientes ao inicializar
  }

  // Função para carregar os clientes (aqui você pode substituir pelo seu serviço HTTP)
  carregarClientes() {
    // Exemplo de dados
    this.clientes = [
      { id: 1, nome: 'João Silva', telefone: '123456789', email: 'joao@email.com', endereco: 'Rua A', data: '2022-01-01' },
      { id: 2, nome: 'Maria Oliveira', telefone: '987654321', email: 'maria@email.com', endereco: 'Rua B', data: '2022-02-01' }
    ];
    this.clientesFiltrados = this.clientes;  // Inicializa os clientes filtrados com todos
  }

  // Função para adicionar um cliente
  adicionarCliente() {
    console.log('Adicionar cliente');
    // Aqui você pode implementar a navegação para a página de cadastro ou abrir um modal
  }

  // Função para filtrar os clientes com base no termo de pesquisa
  filtrarClientes() {
    const termo = this.filtro.toLowerCase();
    this.clientesFiltrados = this.clientes.filter(cliente =>
      Object.values(cliente).some(valor =>
        String(valor).toLowerCase().includes(termo)
      )
    );
  }

  // Função para editar um cliente
  editarCliente(cliente: any) {
    console.log('Editar cliente:', cliente);
    // Lógica para editar o cliente (pode ser uma navegação ou abrir um modal)
  }

  // Função para excluir um cliente
  excluirCliente(cliente: any) {
    this.confirmarExclusao(cliente);
  }

  // Função para confirmar a exclusão de um cliente
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
            this.clientes = this.clientes.filter(c => c.id !== cliente.id);  // Excluindo o cliente
            this.clientesFiltrados = this.clientes;  // Recarregando a lista de clientes
            console.log('Cliente excluído');
          },
        },
      ],
    });

    await alert.present();
  }
}
