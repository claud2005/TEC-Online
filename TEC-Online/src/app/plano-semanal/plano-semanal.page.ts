import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, IonModal } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-plano-semanal',
  templateUrl: './plano-semanal.page.html',
  styleUrls: ['./plano-semanal.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
  ],
})
export class PlanoSemanalPage {
  @ViewChild('modal') modal!: IonModal;

  constructor(private router: Router) {}

  // Método para abrir o modal
  openModal(event: any) {
    const selectedDate = event.detail.value;  // Obtém a data selecionada
    console.log('Data selecionada:', selectedDate);
    this.modal.present();  // Abre o modal
  }

  // Método para fechar o modal
  async closeModal() {
    console.log('Fechando o modal...');
    await this.modal.dismiss();  // Garante que o modal seja fechado
  }

  // Método para navegar para outra página
  async navigateToOtherPage() {
    console.log('Fechando o modal e navegando para /criar-servicos');
    await this.modal.dismiss();  // Garante que o modal seja fechado
    this.router.navigate(['/criar-servicos']);  // Navega para a página de criação de serviços
  }

  // Método para navegar para a página de perfil
  async navigateToPerfil() {
    console.log('Fechando o modal e navegando para /perfil');
    await this.modal.dismiss();  // Garante que o modal seja fechado
    this.router.navigate(['/perfil']);  // Navega para a página do perfil
  }

  // Método para navegar para a página de serviços
  async navigateToServicos() {
    console.log('Fechando o modal e navegando para /servicos');
    await this.modal.dismiss();  // Garante que o modal seja fechado
    this.router.navigate(['/servicos']);  // Navega para a página de serviços
  }
}
