import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http'; // Importar para fazer requisições HTTP

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule]
})
export class HomePage {
  username: string = ''; // Para capturar o nome de usuário
  password: string = ''; // Para capturar a senha

  constructor(private router: Router, private http: HttpClient) {}

  // Função de login
  entrar() {
    const userData = { username: this.username, password: this.password };

    this.http.post('http://localhost:3000/api/login', userData).subscribe(
      (response: any) => {
        console.log('Login bem-sucedido', response);
        localStorage.setItem('token', response.token); // Armazenar o token no localStorage
        this.router.navigate(['/plano-semanal']); // Redirecionar após login
      },
      (error) => {
        console.error('Erro no login', error);
        alert('Usuário ou senha inválidos!');
      }
    );
  }

  // Função de registro
  registrar() {
    this.router.navigate(['/signup']);
  }
}
