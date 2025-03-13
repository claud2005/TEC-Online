import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Platform } from '@ionic/angular';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';

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
  isLoading: boolean = false;
  erroCarregamento: string | null = null;

  constructor(
    private platform: Platform,
    private router: Router,
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {
    this.isWeb = !this.platform.is('hybrid');
  }

  ngOnInit() {
    this.token = localStorage.getItem('token');
    console.log('Token encontrado no localStorage:', this.token);

    if (!this.token) {
      console.warn('Token não encontrado! Redirecionando para login.');
      this.router.navigate(['/home']);
      return;
    }

    this.carregarDadosPerfil();
  }

  carregarDadosPerfil() {
    this.isLoading = true;
    this.erroCarregamento = null;
    console.log('🔄 Iniciando carregamento do perfil...');
    console.log('📡 Enviando requisição com token:', this.token);

    if (!this.token) {
      console.warn('Token ausente! Redirecionando para login...');
      localStorage.removeItem('token');
      this.router.navigate(['/home']);
      return;
    }

    this.http.get<any>('http://localhost:3000/api/profile', {
      headers: {
        'Authorization': `Bearer ${this.token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    }).subscribe(
      (data) => {
        console.log('✅ Dados do perfil recebidos:', data);
        this.isLoading = false;
        this.nomeCompleto = data.fullName || 'Nome não disponível';
        this.nomeUtilizador = data.username || 'Utilizador não disponível';
        this.fotoPerfil = data.profilePicture || this.fotoPerfil;
        this.cdr.detectChanges(); // Força a atualização da tela
      },
      (error) => {
        this.isLoading = false;
        this.erroCarregamento = 'Erro ao carregar dados do perfil.';
        console.error('❌ Erro ao carregar perfil:', error);
        console.error('🛑 Status:', error.status);
        console.error('📢 Mensagem:', error.message);

        // Tratamento para erro de autenticação
        if (error.status === 401 || error.status === 403) {
          console.warn('⚠ Token inválido ou expirado! Redirecionando...');
          this.logout();
        }
      }
    );
  }

  // Método para alterar foto
  async alterarFoto() {
    if (this.isWeb) {
      document.getElementById('fileInput')?.click();
      return;
    }

    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: true,
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

  // Método para lidar com o arquivo selecionado na versão web
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

  // Método para salvar o perfil, incluindo a foto de perfil
  salvarPerfil() {
    this.isLoading = true;

    // Criar um FormData para enviar a imagem e os dados do perfil
    const formData = new FormData();
    formData.append('fullName', this.nomeCompleto);
    formData.append('username', this.nomeUtilizador);

    // Se a foto de perfil foi alterada, adicionar o arquivo da imagem ao FormData
    if (this.fotoPerfil && typeof this.fotoPerfil !== 'string') {
      const fotoBlob = this.base64ToBlob(this.fotoPerfil);
      formData.append('profilePicture', fotoBlob, 'profilePicture.jpg');
    }

    // Enviar os dados para o servidor via PUT (ou POST, dependendo da sua API)
    this.http.put('http://localhost:3000/api/profile', formData, {
      headers: {
        'Authorization': `Bearer ${this.token}`,
      }
    }).subscribe(
      (response: any) => {
        this.isLoading = false;
        console.log('Perfil atualizado com sucesso:', response);
        alert('Perfil atualizado com sucesso!');
      },
      (error) => {
        this.isLoading = false;
        console.error('Erro ao atualizar perfil:', error);
        alert('Erro ao atualizar perfil. Tente novamente.');
        if (error.status === 401 || error.status === 403) {
          this.logout();
        }
      }
    );
  }

  // Função auxiliar para converter base64 em Blob
  base64ToBlob(base64: string): Blob {
    const byteCharacters = atob(base64.split(',')[1]);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += 512) {
      const slice = byteCharacters.slice(offset, offset + 512);
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      byteArrays.push(new Uint8Array(byteNumbers));
    }

    return new Blob(byteArrays, { type: 'image/jpeg' });
  }

  // Função para tentar novamente o carregamento dos dados do perfil
  tentarNovamente() {
    this.carregarDadosPerfil();
  }

  // Função para logout
  logout() {
    localStorage.removeItem('token');
    this.nomeCompleto = '';
    this.nomeUtilizador = '';
    this.fotoPerfil = 'assets/img/default-profile.png';
    this.router.navigate(['/home']);
  }

  // Navegar para editar perfil
  editarPerfil() {
    this.router.navigate(['/editar-perfil']);
  }

  // Navegar para o plano semanal
  voltarParaPlanoSemanal() {
    this.router.navigate(['/plano-semanal']);
  }
}
