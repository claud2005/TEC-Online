import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Platform } from '@ionic/angular';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  standalone: true,
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
  imports: [IonicModule, CommonModule, FormsModule],
})
export class PerfilPage implements OnInit {
  fotoPerfil: string = 'assets/img/default-profile.png';
  nomeCompleto: string = '';
  nomeUtilizador: string = '';
  isWeb: boolean;
  token: string | null = null;

  constructor(
    private platform: Platform,
    private router: Router,
    private http: HttpClient,
    private cdr: ChangeDetectorRef // Inject ChangeDetectorRef
  ) {
    this.isWeb = !this.platform.is('hybrid');
  }

  ngOnInit() {
    this.token = localStorage.getItem('token');
    console.log('Token encontrado:', this.token);

    if (!this.token) {
      console.warn('Token não encontrado! Redirecionando para login.');
      this.router.navigate(['/home']);
    } else {
      this.carregarDadosPerfil();
    }
  }

  carregarDadosPerfil() {
    console.log('Buscando perfil do usuário...');
    
    this.http.get<any>('http://localhost:3000/api/users/profile', {
      headers: { Authorization: `Bearer ${this.token}` },
    }).subscribe(
      (data) => {
        console.log('Dados do perfil recebidos:', data);

        if (!data) {
          console.error('Erro: Nenhum dado recebido.');
          return;
        }

        // A resposta deve ter o 'fullName' e 'username'
        this.nomeCompleto = data.fullName || 'Nome não disponível';
        this.nomeUtilizador = data.username || 'Usuário não disponível';
        this.fotoPerfil = data.profilePicture || this.fotoPerfil;

        // Forçar a detecção de mudanças
        this.cdr.detectChanges();
      },
      (error) => {
        console.error('Erro ao carregar perfil:', error);
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
        this.cdr.detectChanges(); // Forçar atualização quando a foto é alterada
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
        this.cdr.detectChanges(); // Forçar atualização quando a foto é alterada
      };
      reader.readAsDataURL(file);
    }
  }

  salvarPerfil() {
    const perfilAtualizado = {
      fullName: this.nomeCompleto,
      username: this.nomeUtilizador,
      profilePicture: this.fotoPerfil,
    };

    this.http.put('http://localhost:3000/api/users/profile', perfilAtualizado, {
      headers: { Authorization: `Bearer ${this.token}` },
    }).subscribe(
      (response) => {
        console.log('Perfil atualizado com sucesso:', response);
        alert('Perfil atualizado com sucesso!');
      },
      (error) => {
        console.error('Erro ao atualizar perfil:', error);
        alert('Erro ao atualizar perfil. Tente novamente.');
      }
    );
  }

  logout() {
    localStorage.removeItem('token');
    this.nomeCompleto = '';
    this.nomeUtilizador = '';
    this.fotoPerfil = 'assets/img/default-profile.png';
    this.router.navigate(['/home']);
  }

  editarPerfil() {
    this.router.navigate(['/editar-perfil']);
  }
}
