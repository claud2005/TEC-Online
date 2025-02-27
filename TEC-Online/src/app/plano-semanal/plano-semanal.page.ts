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
    const selectedDate = event.detail.value;
    console.log('Data selecionada:', selectedDate);
    this.modal.present();
  }

  // Método para fechar o modal
  closeModal() {
    this.modal.dismiss();
  }

  // Método para navegar para outra página
  navigateToOtherPage() {
    // Fecha o modal primeiro
    this.modal.dismiss().then(() => {
      // Navega para a próxima página após o modal ser fechado
      this.router.navigate(['/servicos']); // Altere '/servicos' para o caminho da sua página
    });
  }

  // Método para navegar para a página do perfil
  navigateToPerfil() {
    console.log('Navegando para o perfil...');
    this.modal.dismiss().then(() => {
      this.router.navigate(['/perfil']).then(() => {
        console.log('Navegação para o perfil concluída.');
      });
    });
  }
  
  }

