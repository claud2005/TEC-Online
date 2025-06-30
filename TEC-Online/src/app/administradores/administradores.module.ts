import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { AdministradoresPage } from './administradores.page';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    AdministradoresPage  // IMPORTANDO o standalone component aqui
  ],
})
export class AdministradoresPageModule {}
