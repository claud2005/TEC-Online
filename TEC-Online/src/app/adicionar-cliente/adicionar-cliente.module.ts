import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AdicionarClientePageRoutingModule } from './adicionar-cliente-routing.module'; // Se necessário

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AdicionarClientePageRoutingModule
  ],
  // Remova a linha abaixo, já que o componente é standalone
  // declarations: [AdicionarClientePage] 
})
export class AdicionarClientePageModule {}
