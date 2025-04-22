import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';  // Importando o IonicModule

@Component({
  selector: 'app-gestor-clientes',
  templateUrl: './gestor-clientes.page.html',
  styleUrls: ['./gestor-clientes.page.scss'],
  standalone: true,   // Definindo que este é um componente standalone
  imports: [IonicModule]  // Garantindo que os componentes do Ionic sejam reconhecidos
})
export class GestorClientesPage {
  constructor() {}

  ngOnInit() {
    // Sua lógica de inicialização aqui
  }
}
