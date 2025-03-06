import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';  // Importando o IonicModule aqui

@Component({
  selector: 'app-editar-servicos',
  templateUrl: './editar-servicos.page.html',
  styleUrls: ['./editar-servicos.page.scss'],
  standalone: true,  // Componente standalone
  imports: [IonicModule],  // Adicionando o IonicModule aqui
})
export class EditarServicosPage {}