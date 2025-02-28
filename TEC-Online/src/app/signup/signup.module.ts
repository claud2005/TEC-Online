import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular'; // Certifique-se de importar o IonicModule
import { CommonModule } from '@angular/common'; 
import { FormsModule } from '@angular/forms'; 

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule] // Certifique-se de adicionar o IonicModule aqui
})
export class SignupPage {
  // O seu código para a página de registro
}
