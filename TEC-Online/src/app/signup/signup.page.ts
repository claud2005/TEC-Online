import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common'; 
import { FormsModule } from '@angular/forms'; 
import { environment } from 'src/environments/environment';

interface User {
  _id?: string;
  fullName: string;
  username: string;
  email: string;
  telefone?: string;
  password?: string;
}

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule]
})
export class SignupPage implements OnInit {
  utilizadores: User[] = [];
  utilizador: User = this.getEmptyUser();
  confirmPassword: string = '';
  editing: boolean = false;

  constructor(private router: Router, private http: HttpClient) {}

  ngOnInit() {
    this.loadUsers();
  }

  getEmptyUser(): User {
    return {
      fullName: '',
      username: '',
      email: '',
      telefone: '',
      password: ''
    };
  }

  loadUsers() {
    this.http.get<User[]>(`${environment.api_url}/api/users`).subscribe(
      (data) => {
        this.utilizadores = data;
      },
      (error) => {
        console.error('Erro ao carregar utilizadores', error);
      }
    );
  }

  submitForm() {
    if (!this.utilizador.fullName || !this.utilizador.username || !this.utilizador.email) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    if (!this.editing && (!this.utilizador.password || this.utilizador.password.length < 6)) {
      alert('A senha deve ter pelo menos 6 caracteres.');
      return;
    }

    if (!this.editing && this.utilizador.password !== this.confirmPassword) {
      alert('As senhas não coincidem.');
      return;
    }

    if (this.editing) {
      // Atualizar utilizador
      this.http.put(`${environment.api_url}/api/users/${this.utilizador._id}`, this.utilizador).subscribe(
        () => {
          alert('Utilizador atualizado com sucesso!');
          this.cancelEdit();
          this.loadUsers();
        },
        (error) => {
          console.error('Erro ao atualizar utilizador', error);
          alert('Erro ao atualizar utilizador');
        }
      );
    } else {
      // Criar utilizador
      this.http.post(`${environment.api_url}/api/signup`, this.utilizador).subscribe(
        () => {
          alert('Utilizador criado com sucesso!');
          this.utilizador = this.getEmptyUser();
          this.confirmPassword = '';
          this.loadUsers();
        },
        (error) => {
          console.error('Erro ao criar utilizador', error);
          alert(error.error?.message || 'Erro ao criar utilizador');
        }
      );
    }
  }

  editUser(u: User) {
    this.editing = true;
    this.utilizador = { ...u };
    this.confirmPassword = '';
  }

  cancelEdit() {
    this.editing = false;
    this.utilizador = this.getEmptyUser();
    this.confirmPassword = '';
  }

  deleteUser(u: User) {
    if (confirm(`Tem certeza que deseja excluir o utilizador ${u.fullName}?`)) {
      this.http.delete(`${environment.api_url}/api/users/${u._id}`).subscribe(
        () => {
          alert('Utilizador excluído com sucesso!');
          this.loadUsers();
        },
        (error) => {
          console.error('Erro ao excluir utilizador', error);
          alert('Erro ao excluir utilizador');
        }
      );
    }
  }
}
