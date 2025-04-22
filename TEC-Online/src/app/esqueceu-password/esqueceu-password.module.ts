import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EsqueceuPasswordPageRoutingModule } from './esqueceu-password-routing.module';

import { EsqueceuPasswordPage } from './esqueceu-password.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EsqueceuPasswordPageRoutingModule,
    EsqueceuPasswordPage // Directly import the standalone component
  ]
})
export class EsqueceuPasswordPageModule {}
