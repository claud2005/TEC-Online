import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ServicosPageRoutingModule } from './servicos-routing.module';
import { ServicosPage } from './servicos.page'; // Importe normalmente

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ServicosPageRoutingModule,
    ServicosPage, // IMPORTAÇÃO CORRETA PARA COMPONENTES STANDALONE
  ],
})
export class ServicosPageModule {}
