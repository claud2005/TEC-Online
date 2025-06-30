import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common'; 
import { FormsModule } from '@angular/forms'; 
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule]
})
export class SignupPage {
  fullName: string = '';
  username: string = '';
  email: string = '';
  telefone: string = '';       // <-- Nova propriedade telefone
  password: string = '';
  confirmPassword: string = '';

  constructor(private router: Router, private http: HttpClient) {}

  submitForm() {
    if (!this.fullName || !this.username || !this.password || !this.confirmPassword) {
      alert('Por favor, preencha todos os campos.');
      return;
    }

    if (this.password !== this.confirmPassword) {
      alert('As senhas não coincidem');
      return;
    }

    // Opcional: validar telefone aqui, se quiser

    const userData = {
      fullName: this.fullName,
      username: this.username,
      email: this.email || `${this.username}@example.com`,
      telefone: this.telefone,        // <-- Adicionado telefone aqui
      password: this.password
    };

    this.http.post(`${environment.api_url}/api/signup`, userData).subscribe(
      (response: any) => {
        console.log('Usuário registrado com sucesso', response);
        this.router.navigate(['/home']);
      },
      (error) => {
        console.error('Erro ao registrar usuário', error);
        alert('Erro ao registrar usuário');
      }
    );
  }

  goToLogin() {
    this.router.navigate(['/home']);
  }
}
