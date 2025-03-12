import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { IonicModule } from '@ionic/angular'; // Importe o IonicModule aqui
import { CommonModule } from '@angular/common'; // Importe o CommonModule aqui
import { FormsModule } from '@angular/forms'; // Importe o FormsModule aqui

@Component({
  selector: 'app-editar-perfil',
  templateUrl: './editar-perfil.page.html',
  styleUrls: ['./editar-perfil.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule], // Agora temos IonicModule, CommonModule e FormsModule
})
export class EditarPerfilPage {
  perfil: any = { fullName: '', username: '' };
  isLoading: boolean = false;

  constructor(private router: Router, private http: HttpClient) {}

  ngOnInit() {
    const storedProfile = localStorage.getItem('perfil');
    if (storedProfile) {
      this.perfil = JSON.parse(storedProfile);
    }
  }

  salvarPerfil() {
    if (this.perfil.fullName && this.perfil.username) {
      this.isLoading = true;
      const perfilAtualizado = {
        fullName: this.perfil.fullName,
        username: this.perfil.username,
        profilePicture: this.perfil.profilePicture || 'defaultProfilePic.png',  // Atribuir uma foto padrão, caso não tenha
      };

      const token = localStorage.getItem('token');  // Recuperando o token diretamente

      if (!token) {
        console.error('Token não encontrado');
        this.isLoading = false;
        return;
      }

      this.http.put('http://localhost:3000/api/profile', perfilAtualizado, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }).subscribe(
        (response: any) => {
          this.isLoading = false;
          console.log('Perfil atualizado com sucesso:', response);
          alert('Perfil atualizado com sucesso!');
          this.router.navigate(['/perfil']);  // Redireciona para a página de perfil após atualização
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
    } else {
      alert('Por favor, preencha todos os campos obrigatórios!');
    }
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('perfil');
    this.router.navigate(['/home']);
  }
}
