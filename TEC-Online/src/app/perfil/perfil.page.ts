import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular'; // ✅ Importa o módulo do Ionic
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Platform } from '@ionic/angular';
import { Router } from '@angular/router'; // ✅ Importa o Router

@Component({
  standalone: true,
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
  imports: [IonicModule, CommonModule, FormsModule], // ✅ Importa aqui!
})
export class PerfilPage {

  fotoPerfil: string = 'assets/icon/user.png';
  isWeb: boolean;

  constructor(private platform: Platform, private router: Router) { // ✅ Injeta o Router
    this.isWeb = !this.platform.is('hybrid');
    if (!this.isWeb) {
      this.checkCameraPermissions();
    }
  }

  async checkCameraPermissions() {
    try {
      const permission = await Camera.checkPermissions();
      if (permission.photos !== 'granted') {
        await Camera.requestPermissions({ permissions: ['photos'] });
      }
    } catch (error) {
      console.error('Erro ao verificar permissões da câmera:', error);
    }
  }

  async alterarFoto() {
    if (this.isWeb) {
      document.getElementById('fileInput')?.click();
      return;
    }

    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Prompt,
      });

      if (image.dataUrl) {
        this.fotoPerfil = image.dataUrl;
      }
    } catch (error) {
      console.error('Erro ao capturar imagem:', error);
    }
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.fotoPerfil = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  // Função para redirecionar para a página de home (Logout)
  logout() {
    this.router.navigate(['/home']); // Redireciona para a página home
  }

  // Função para redirecionar para a página de editar perfil
  editarPerfil() {
    this.router.navigate(['/editar-perfil']); // Redireciona para a página editar-perfil
  }
}
