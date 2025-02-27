import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // Importe o CommonModule para *ngFor
import { FormsModule } from '@angular/forms'; // Importe o FormsModule para ngModel
import { IonicModule } from '@ionic/angular'; // Importe o IonicModule para componentes do Ionic
import { Router } from '@angular/router';

@Component({
  selector: 'app-plano-semanal',
  templateUrl: './plano-semanal.page.html',
  styleUrls: ['./plano-semanal.page.scss'],
  standalone: true, // Certifique-se de que o componente é standalone
  imports: [
    CommonModule, // Para usar *ngFor e outras diretivas do Angular
    FormsModule,  // Para usar ngModel
    IonicModule,  // Para usar componentes do Ionic
  ],
})
export class PlanoSemanalPage {

  }