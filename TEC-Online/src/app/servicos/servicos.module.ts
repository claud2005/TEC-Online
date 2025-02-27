import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ServicosPageRoutingModule } from './servicos-routing.module';
import { ServicosPage } from './servicos.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ServicosPageRoutingModule,
    ServicosPage, // Importe o componente standalone aqui
  ],
})
export class ServicosPageModule {}