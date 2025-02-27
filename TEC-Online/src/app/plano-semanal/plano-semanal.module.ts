import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PlanoSemanalPageRoutingModule } from './plano-semanal-routing.module';

import { PlanoSemanalPage } from './plano-semanal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PlanoSemanalPageRoutingModule,
    PlanoSemanalPage,
  ],
})
export class PlanoSemanalPageModule {}
