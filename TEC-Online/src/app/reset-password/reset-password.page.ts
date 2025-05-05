import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { IonicModule, AlertController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-reset-password',
  imports: [IonicModule, CommonModule, ReactiveFormsModule],
  templateUrl: './reset-password.page.html',
  styleUrls: ['./reset-password.page.scss'],
})
export class ResetPasswordPage implements OnInit {
  token: string = '';
  isTokenValid: boolean = false;
  resetForm!: FormGroup;
  passwordsDoNotMatch: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    this.token = this.route.snapshot.paramMap.get('token') || '';

    if (this.token) {
      this.http.get(`http://localhost:3000/verify-token/${this.token}`).subscribe(
        (res: any) => {
          this.isTokenValid = true;
        },
        async (err) => {
          console.error('Erro ao validar o token:', err);
          this.isTokenValid = false;
          const alert = await this.alertController.create({
            header: 'Erro',
            message: 'O token de redefinição de senha é inválido ou expirou. Tente novamente.',
            buttons: ['OK']
          });
          await alert.present();
        }
      );
    } else {
      this.isTokenValid = false;
    }

    this.resetForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
    });
  }

  async onSubmit() {
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
      async (res) => {
        console.log('Senha alterada com sucesso!', res);

        const alert = await this.alertController.create({
          header: 'Sucesso',
          message: 'Sua senha foi alterada com sucesso!',
          buttons: [{
            text: 'OK',
            handler: () => {
              // Redireciona para a página de login após clicar em OK
              this.router.navigate(['/login']);
            }
          }]
        });

        await alert.present();
      },
      async (err) => {
        console.error('Erro ao alterar senha:', err);
        const alert = await this.alertController.create({
          header: 'Erro',
          message: 'Ocorreu um erro ao tentar alterar sua senha. Tente novamente mais tarde.',
          buttons: ['OK']
        });
        await alert.present();
      }
    );
  }
}