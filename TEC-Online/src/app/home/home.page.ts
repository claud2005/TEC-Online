import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular'; 
import { CommonModule } from '@angular/common'; 
import { FormsModule } from '@angular/forms'; 

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule]
})
export class HomePage implements OnInit {
  
  constructor() {
    // Construtor da classe
  }

  ngOnInit() {
    // Este método é chamado quando o componente é inicializado
    console.log("HomePage carregada!");
  }
}
