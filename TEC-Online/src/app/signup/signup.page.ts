import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Location } from '@angular/common';
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
  role?: string;
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
  userId: string | null = null;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient,
    private location: Location
  ) {}

  ngOnInit() {
    this.userId = this.route.snapshot.paramMap.get('id');
    if (this.userId) {
      this.loadUser(this.userId);
      this.editing = true;
    } else {
      this.loadUsers();
      this.editing = false;
      this.utilizador = this.getEmptyUser();
    }
  }

  getEmptyUser(): User {
    return {
      fullName: '',
      username: '',
      email: '',
      telefone: '',
      password: '',
      role: 'user' // valor padrão
    };
  }

  loadUsers() {
    this.http.get<User[]>(`${environment.api_url}/api/users`).subscribe(
      data => {
        this.utilizadores = data;
      },
      error => {
        console.error('Erro ao carregar utilizadores', error);
        alert('Erro ao carregar utilizadores');
      }
    );
  }

  loadUser(id: string) {
    const token = localStorage.getItem('token') || '';
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.get<User>(`${environment.api_url}/api/users/${id}`, { headers }).subscribe(
      user => {
        this.utilizador = { ...user, password: '' }; // limpa senha para edição
      },
      error => {
        console.error('Erro ao carregar utilizador', error);
        alert('Erro ao carregar dados do utilizador');
        this.location.back();
      }
    );
  }

  submitForm() {
    // Validação campos obrigatórios
    if (!this.utilizador.fullName.trim() || !this.utilizador.username.trim() || !this.utilizador.email.trim() || !this.utilizador.role) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    if (!this.editing) {
      // Validação senha no cadastro
      if (!this.utilizador.password || this.utilizador.password.length < 6) {
        alert('A senha deve ter pelo menos 6 caracteres.');
        return;
      }
      if (this.utilizador.password !== this.confirmPassword) {
        alert('As senhas não coincidem.');
        return;
      }

      this.http.post(`${environment.api_url}/api/signup`, this.utilizador).subscribe(
        () => {
          alert('Utilizador criado com sucesso!');
          this.utilizador = this.getEmptyUser();
          this.confirmPassword = '';
          this.loadUsers();
        },
        error => {
          console.error('Erro ao criar utilizador', error);
          alert(error.error?.message || 'Erro ao criar utilizador');
        }
      );

    } else {
      // Atualizar utilizador
      const dataToUpdate = { ...this.utilizador };
      if (!dataToUpdate.password || dataToUpdate.password.trim() === '') {
        delete dataToUpdate.password; // não atualiza senha se vazia
      }

      this.http.put(`${environment.api_url}/api/users/${this.utilizador._id}`, dataToUpdate).subscribe(
        () => {
          alert('Utilizador atualizado com sucesso!');
          this.cancelEdit();
          this.loadUsers();
          this.router.navigate(['/signup']);
        },
        error => {
          console.error('Erro ao atualizar utilizador', error);
          alert('Erro ao atualizar utilizador');
        }
      );
    }
  }

  editUser(u: User) {
    this.router.navigate(['/signup', u._id]);
  }

  cancelEdit() {
    this.editing = false;
    this.utilizador = this.getEmptyUser();
    this.confirmPassword = '';
    this.router.navigate(['/signup']);
  }

  deleteUser(u: User) {
    if (confirm(`Tem certeza que deseja excluir o utilizador ${u.fullName}?`)) {
      this.http.delete(`${environment.api_url}/api/users/${u._id}`).subscribe(
        () => {
          alert('Utilizador excluído com sucesso!');
          this.loadUsers();
        },
        error => {
          console.error('Erro ao excluir utilizador', error);
          alert('Erro ao excluir utilizador');
        }
      );
    }
  }

  goBack() {
  this.router.navigate(['/administradores']);
}

}
