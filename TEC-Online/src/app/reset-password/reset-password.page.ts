import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  standalone: true,
  selector: 'app-reset-password',
  imports: [IonicModule, CommonModule],
  templateUrl: './reset-password.page.html',
  styleUrls: ['./reset-password.page.scss'],
})
export class ResetPasswordPage {
  token: string = '';
  novaSenha: string = ''; // Nova senha

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit() {
    this.token = this.route.snapshot.paramMap.get('token') || '';
    console.log('Token na URL:', this.token);
  }

  // Função para enviar a nova senha
  resetPassword() {
    if (!this.token || !this.novaSenha) {
      console.log('Token ou nova senha ausentes!');
      return;
    }

    this.http.post('http://localhost:3000/reset-password', {
      token: this.token,
      novaSenha: this.novaSenha,
    }).subscribe(
      (response) => {
        console.log('Senha alterada com sucesso:', response);
      },
      (error) => {
        console.error('Erro ao alterar senha:', error);
      }
    );
  }
}
