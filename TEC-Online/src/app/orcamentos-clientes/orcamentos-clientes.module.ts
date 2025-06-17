import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { OrcamentosClientesPageRoutingModule } from './orcamentos-clientes-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OrcamentosClientesPageRoutingModule
  ],
  // NÃO declarar o componente aqui porque ele é standalone
})
export class OrcamentosClientesPageModule {}
