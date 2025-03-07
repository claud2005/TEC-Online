import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common'; 
import { FormsModule } from '@angular/forms'; 

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule]
})
export class SignupPage {
  fullName: string = '';           // Propriedade 'fullName' adicionada
  username: string = '';           // Propriedade 'username'
  email: string = '';              // Propriedade 'email'
  password: string = '';           // Propriedade 'password'
  confirmPassword: string = '';    // Propriedade 'confirmPassword'

  constructor(private router: Router, private http: HttpClient) {}

  // Método para enviar o formulário
  submitForm() {
    if (!this.fullName || !this.username || !this.password || !this.confirmPassword) {
      alert('Por favor, preencha todos os campos.');
      return;
    }

    if (this.password !== this.confirmPassword) {
      alert('As senhas não coincidem');
      return;
    }

    const userData = {
      fullName: this.fullName,       // Adicionando 'fullName' ao objeto userData
      username: this.username,
      email: this.email || `${this.username}@example.com`, // Usa email se disponível, caso contrário, cria um exemplo
      password: this.password
    };

    this.http.post('http://localhost:3000/api/signup', userData).subscribe(
      (response: any) => {
        console.log('Usuário registrado com sucesso', response);
        this.router.navigate(['/home']); // Redireciona após o registro
      },
      (error) => {
        console.error('Erro ao registrar usuário', error);
        alert('Erro ao registrar usuário');
      }
    );
  }

  // Método para voltar
  goBack() {
    this.router.navigate(['/home']);
  }
}
