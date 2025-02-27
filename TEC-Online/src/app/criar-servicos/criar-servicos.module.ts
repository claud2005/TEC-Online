import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CriarServicosPageRoutingModule } from './criar-servicos-routing.module';

import { CriarServicosPage } from './criar-servicos.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CriarServicosPageRoutingModule,
    CriarServicosPage
  ],
})
export class CriarServicosPageModule {}
