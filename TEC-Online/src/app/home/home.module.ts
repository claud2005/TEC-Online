import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HomePage } from './home.page';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild([{ path: '', component: HomePage }]) // Importando o HomePage aqui
  ],
  exports: [],
  declarations: [], // Removendo HomePage daqui
})
export class HomePageModule {}
