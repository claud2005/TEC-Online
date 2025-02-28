import { Router } from '@angular/router'; // Import Router
import { Component } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';


@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule]
})
export class PerfilPage {
  constructor(private router: Router) {}
  editarperfil() {
    this.router.navigate(['/editar-perfil']);
  }

  logout() {
    this.router.navigate(['/home']);
  }


  fotoPerfil: string | null = null; // Adicionando variável

  async alterarFoto() {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Prompt
      });
  
      this.fotoPerfil = image.dataUrl || this.fotoPerfil; // Mantém a foto antiga caso não tenha nova
    } catch (error) {
      console.error('Erro ao capturar imagem', error);
    }
  }
  
}