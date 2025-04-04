import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
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
  nomeCompleto: string = '';
  nomeUtilizador: string = '';
  fotoPerfil: string | null = null; // Adicionando fotoPerfil
  token: string | null = null;
  isLoading: boolean = false;
  erroCarregamento: string | null = null;

  constructor(
    private router: Router,
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}

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
        this.isLoading = false;
        this.nomeCompleto = data.fullName || 'Nome não disponível';
        this.nomeUtilizador = data.username || 'Utilizador não disponível';
        this.fotoPerfil = data.profilePicture || null; // Atualizando fotoPerfil
        console.log('Foto de perfil recebida da API:', this.fotoPerfil); // Logando o valor de fotoPerfil
        this.cdr.detectChanges(); // Força a atualização da tela
      },
      (error) => {
        this.isLoading = false;
        this.erroCarregamento = 'Erro ao carregar dados do perfil.';
        console.error('❌ Erro ao carregar perfil:', error);
  
        if (error.status === 401 || error.status === 403) {
          console.warn('⚠ Token inválido ou expirado! Redirecionando...');
          this.logout();
        }
      }
    );
  }  

  salvarPerfil() {
    this.isLoading = true;

    const formData = new FormData();
    formData.append('fullName', this.nomeCompleto);
    formData.append('username', this.nomeUtilizador);

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

  tentarNovamente() {
    this.carregarDadosPerfil();
  }

  logout() {
    localStorage.removeItem('token');
    this.nomeCompleto = '';
    this.nomeUtilizador = '';
    this.fotoPerfil = null; // Limpa foto de perfil
    this.cdr.detectChanges(); // 🔄 Força a UI a atualizar
    this.router.navigate(['/home']);
  }

  editarPerfil() {
    this.router.navigate(['/editar-perfil']);
  }

  voltarParaPlanoSemanal() {
    this.router.navigate(['/plano-semanal']);
  }
}
