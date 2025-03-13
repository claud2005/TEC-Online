import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-editar-perfil',
  templateUrl: './editar-perfil.page.html',
  styleUrls: ['./editar-perfil.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
})
export class EditarPerfilPage {
  perfil: any = { fullName: '', username: '', profilePicture: '' };
  isLoading: boolean = false;
  token: string | null = null;

  constructor(private router: Router, private http: HttpClient) {}

  ngOnInit() {
    this.token = localStorage.getItem('token');

    if (!this.token) {
      console.warn('Token não encontrado! Redirecionando...');
      this.router.navigate(['/home']);
      return;
    }

    this.carregarPerfil();
  }

  carregarPerfil() {
    this.isLoading = true;

    this.http.get<any>('http://localhost:3000/api/profile', {
      headers: { Authorization: `Bearer ${this.token}` },
    }).subscribe(
      (data) => {
        this.perfil = data;
        this.isLoading = false;
      },
      (error) => {
        console.error('Erro ao carregar perfil:', error);
        if (error.status === 401 || error.status === 403) {
          this.logout();
        }
        this.isLoading = false;
      }
    );
  }

  salvarPerfil() {
    if (!this.perfil.fullName || !this.perfil.username) {
      alert('Por favor, preencha todos os campos obrigatórios!');
      return;
    }

    this.isLoading = true;

    this.http.put('http://localhost:3000/api/profile', this.perfil, {
      headers: { Authorization: `Bearer ${this.token}`, 'Content-Type': 'application/json' }
    }).subscribe(
      (response) => {
        console.log('Perfil atualizado com sucesso:', response);
        alert('Perfil atualizado com sucesso!');
        localStorage.setItem('perfil', JSON.stringify(this.perfil));
        this.router.navigate(['/perfil']);
      },
      (error) => {
        console.error('Erro ao atualizar perfil:', error);
        alert('Erro ao atualizar perfil. Tente novamente.');
        if (error.status === 401 || error.status === 403) {
          this.logout();
        }
        this.isLoading = false;
      }
    );
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('perfil');
    this.router.navigate(['/home']);
  }
}
