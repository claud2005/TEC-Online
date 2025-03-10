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
    
    // Verifique se o token está presente antes de fazer a requisição
    console.log('📡 Enviando requisição com token:', this.token);
    
    if (!this.token) {
      console.error('🚨 Erro: Token não encontrado!');
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
    this.isLoading = true;
    const perfilAtualizado = {
      fullName: this.nomeCompleto,
      username: this.nomeUtilizador,
      profilePicture: this.fotoPerfil,
    };

    this.http.put('http://localhost:3000/api/profile', perfilAtualizado, {
      headers: { 
        'Authorization': `Bearer ${this.token}`,
        'Content-Type': 'application/json'
      }
    }).subscribe(
      (response: any) => {
        this.isLoading = false;
        console.log('Perfil atualizado com sucesso:', response);
        // Usar alertController do Ionic em vez de alert do browser
        alert('Perfil atualizado com sucesso!');
      },
      (error) => {
        this.isLoading = false;
        console.error('Erro ao atualizar perfil:', error);
        console.error('Status:', error.status);
        console.error('Mensagem:', error.message);
        alert('Erro ao atualizar perfil. Tente novamente.');

        // Se for erro de autenticação
        if (error.status === 401 || error.status === 403) {
          this.logout();
        }
      }
    );
  }

  tentarNovamente() {
    this.carregarDadosPerfil();
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