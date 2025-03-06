import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Platform } from '@ionic/angular';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-editar-perfil',
  templateUrl: './editar-perfil.page.html',
  styleUrls: ['./editar-perfil.page.scss'],
  imports: [IonicModule, CommonModule, FormsModule],
})
export class EditarPerfilPage implements OnInit {
  
  fotoPerfil: string = 'assets/icon/user.png';
  perfil: any = { nomeCompleto: '', nomeUtilizador: '' }; // Alterado para perfil
  isWeb: boolean;
  userId: string = 'user-id'; // ID do usuário, ajuste conforme necessário

  constructor(private platform: Platform, private router: Router, private http: HttpClient) { 
    this.isWeb = !this.platform.is('hybrid');
  }

  ngOnInit() {
    this.carregarDadosPerfil();
  }

  carregarDadosPerfil() {
    this.http.get<any>(`http://localhost:3000/api/users/profile`).subscribe(
      (data) => {
        this.perfil.nomeCompleto = data.nomeCompleto;
        this.perfil.nomeUtilizador = data.nomeUtilizador;
        this.fotoPerfil = data.profilePicture || this.fotoPerfil;
      },
      (error) => {
        console.error('Erro ao carregar dados do perfil:', error);
      }
    );
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

  // Função para salvar as alterações no perfil
  salvarPerfil() {
    const perfilAtualizado = {
      nomeCompleto: this.perfil.nomeCompleto,
      nomeUtilizador: this.perfil.nomeUtilizador,
      profilePicture: this.fotoPerfil
    };

    this.http.put(`http://localhost:3000/api/users/profile`, perfilAtualizado).subscribe(
      (response) => {
        console.log('Perfil atualizado com sucesso!', response);
        alert('Perfil atualizado com sucesso!');
        this.router.navigate(['/perfil']);
      },
      (error) => {
        console.error('Erro ao atualizar perfil:', error);
      }
    );
  }

  voltarParaPerfil() {
    this.router.navigate(['/perfil']);
  }
}
