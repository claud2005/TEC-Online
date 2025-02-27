import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';  // Importar IonicModule para usar componentes do Ionic

import { CriarServicosPageRoutingModule } from './criar-servicos-routing.module';
import { CriarServicosPage } from './criar-servicos.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,  // Importar o IonicModule
    CriarServicosPageRoutingModule
  ],
  // Remover CriarServicosPage da lista de declarações, pois ele é standalone
})
export class CriarServicosPageModule {}
