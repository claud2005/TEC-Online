import { Component } from '@angular/core';
import { IonicModule, AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http'; // Importando HttpClient para fazer requisições HTTP

@Component({
  selector: 'app-esqueceu-password',
  standalone: true,
  imports: [IonicModule, FormsModule],
  templateUrl: './esqueceu-password.page.html',
  styleUrls: ['./esqueceu-password.page.scss'],
})
export class EsqueceuPasswordPage {

  email: string = ''; 

  constructor(private router: Router, private alertController: AlertController, private http: HttpClient) {}

  async onSubmit() {
    if (this.email) {
      console.log('Tentando recuperar senha para o e-mail:', this.email);

      this.http.post('http://localhost:3000/api/esqueceu-password', { email: this.email }).subscribe(
        async (response: any) => {
          const alert = await this.alertController.create({
            header: 'Sucesso!',
            message: response.message,
            buttons: ['OK'],
          });
          await alert.present();
          this.router.navigate(['/home']);  // Redireciona para a página de login após o envio
        },
        async (error) => {
          const alert = await this.alertController.create({
            header: 'Erro',
            message: error.error.message || 'Não foi possível enviar o link de recuperação. Tente novamente.',
            buttons: ['OK'],
          });
          await alert.present();
        }
      );
      
    } else {
      const alert = await this.alertController.create({
        header: 'Erro',
        message: 'Por favor, insira um e-mail válido.',
        buttons: ['OK'],
      });
      await alert.present();
    }
  }

  goToLogin() {
    this.router.navigate(['/home']);
  }
}
