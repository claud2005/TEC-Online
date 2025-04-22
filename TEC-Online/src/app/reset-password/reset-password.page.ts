import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';  // Não esqueça de importar o FormGroup e Validators
import { HttpClient } from '@angular/common/http';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';  // Importando ReactiveFormsModule

@Component({
  standalone: true,
  selector: 'app-reset-password',
  imports: [IonicModule, CommonModule, ReactiveFormsModule], // Aqui você adiciona o ReactiveFormsModule
  templateUrl: './reset-password.page.html',
  styleUrls: ['./reset-password.page.scss'],
})
export class ResetPasswordPage implements OnInit {
  token: string = '';
  isTokenValid: boolean = false;  // Variável para verificar a validade do token
  resetForm!: FormGroup;
  passwordsDoNotMatch: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.token = this.route.snapshot.paramMap.get('token') || '';
  
    // Verificando se o token existe
    if (this.token) {
      // Requisição ao servidor para validar o token
      this.http.post('http://localhost:3000/validate-token', { token: this.token }).subscribe(
        (res: any) => {
          this.isTokenValid = res.isValid;  // Supondo que o servidor retorne um campo 'isValid'
        },
        (err) => {
          console.error('Erro ao validar o token:', err);
          this.isTokenValid = false;  // Se ocorrer erro, invalidamos o token
        }
      );
    } else {
      this.isTokenValid = false;  // Caso o token não esteja presente, invalidamos
    }
  
    // Definição do formulário
    this.resetForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
    });
  }
  

  onSubmit() {
    const password = this.resetForm.value.password;
    const confirmPassword = this.resetForm.value.confirmPassword;

    if (password !== confirmPassword) {
      this.passwordsDoNotMatch = true;
      return;
    }

    this.passwordsDoNotMatch = false;

    this.http.post('http://localhost:3000/reset-password', {
      token: this.token,
      novaSenha: password,
    }).subscribe(
      (res) => {
        console.log('Senha alterada com sucesso!', res);
      },
      (err) => {
        console.error('Erro ao alterar senha:', err);
      }
    );
  }
}
