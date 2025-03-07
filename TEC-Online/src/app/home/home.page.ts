import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule]
})
export class HomePage {
  username: string = '';
  password: string = '';

  constructor(private router: Router, private http: HttpClient) {}

  entrar() {
    const userData = { username: this.username, password: this.password };

    this.http.post('http://localhost:3000/api/login', userData).subscribe(
      (response: any) => {
        console.log('Login bem-sucedido', response);
        localStorage.setItem('token', response.token);
        this.router.navigate(['/plano-semanal']);
      },
      (error) => {
        console.error('Erro no login', error);
        alert('Usuário ou senha inválidos!');
      }
    );
  }

  registrar() {
    this.router.navigate(['/signup']);
  }
}
