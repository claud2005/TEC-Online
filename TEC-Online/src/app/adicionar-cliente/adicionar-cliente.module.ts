import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AdicionarClientePageRoutingModule } from './adicionar-cliente-routing.module'; // Importando o roteamento específico

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AdicionarClientePageRoutingModule, // Certifique-se de que a navegação esteja configurada aqui
  ]
})
export class AdicionarClientePageModule {}
