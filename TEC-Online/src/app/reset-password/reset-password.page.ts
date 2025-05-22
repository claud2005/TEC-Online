import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { IonicModule, AlertController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { lastValueFrom } from 'rxjs';

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
      this.http.get(`http://localhost:3000/api/verify-token/${this.token}`).subscribe(
        () => {
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
    }, { validators: this.passwordMatchValidator });

    this.resetForm.valueChanges.subscribe(() => {
      this.passwordsDoNotMatch =
        this.resetForm.get('password')?.value !== this.resetForm.get('confirmPassword')?.value;
    });
  }

  passwordMatchValidator: ValidatorFn = (group: AbstractControl): {[key: string]: any} | null => {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  };

  getPasswordStrengthClass(): string {
    const password = this.resetForm.get('password')?.value;
    if (!password || password.length === 0) return '';

    const strength = this.calculatePasswordStrength(password);
    if (strength < 40) return 'weak';
    if (strength < 70) return 'medium';
    return 'strong';
  }

  getPasswordStrengthText(): string {
    const password = this.resetForm.get('password')?.value;
    if (!password || password.length === 0) return '';

    const strength = this.calculatePasswordStrength(password);
    if (strength < 40) return '🔴 Fraca';
    if (strength < 70) return '🟡 Média';
    return '🟢 Forte';
  }

  private calculatePasswordStrength(password: string): number {
    let strength = 0;
    strength += Math.min(password.length * 5, 40);
    if (/[A-Z]/.test(password)) strength += 15;
    if (/[0-9]/.test(password)) strength += 15;
    if (/[^A-Za-z0-9]/.test(password)) strength += 20;
    if (password.length > 10) strength += 10;
    return Math.min(strength, 100);
  }

  async onSubmit() {
    if (this.resetForm.invalid) return;

    const password = this.resetForm.value.password;

    try {
      const response = await lastValueFrom(
        this.http.post<any>('http://localhost:3000/api/reset-password', {
          token: this.token,
          novaSenha: password
        })
      );

      const alert = await this.alertController.create({
        header: response.success ? 'Sucesso' : 'Erro',
        message: response.message,
        buttons: [{
          text: 'OK',
          handler: () => {
            if (response.success) {
              this.router.navigate(['/login']);
            }
          }
        }]
      });
      await alert.present();
    } catch (error: any) {
      console.error('Erro ao alterar senha:', error);
      const alert = await this.alertController.create({
        header: 'Erro',
        message: error.error?.message || 'Erro desconhecido',
        buttons: ['OK']
      });
      await alert.present();
    }
  }
  showPassword: boolean = false;
showConfirmPassword: boolean = false;

togglePasswordVisibility() {
  this.showPassword = !this.showPassword;
}

toggleConfirmPasswordVisibility() {
  this.showConfirmPassword = !this.showConfirmPassword;
}
}
