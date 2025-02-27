import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, IonModal } from '@ionic/angular';
import { Router } from '@angular/router'; // Importe o Router

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

  constructor(private router: Router) {} // Injete o Router

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
    this.router.navigate(['/servicos']); // Altere '/outra-pagina' para o caminho da sua página
  }
}