import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-editar-perfil',
  templateUrl: './editar-perfil.page.html',
  styleUrls: ['./editar-perfil.page.scss'],
  standalone: true, // Componente standalone
  imports: [CommonModule, FormsModule, IonicModule] // Módulos necessários
})
export class EditarPerfilPage {
  // Exemplo de lógica do componente
  usuario = {
    nome: 'João Silva',
    email: 'joao.silva@example.com',
    telefone: '(11) 98765-4321'
  };

  salvarPerfil() {
    console.log('Perfil salvo:', this.usuario);
    // Aqui você pode adicionar a lógica para salvar os dados do perfil
  }
}