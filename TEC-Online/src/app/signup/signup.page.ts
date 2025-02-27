import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { IonicModule, NavController } from '@ionic/angular';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule],
})
export class SignupPage {
  username: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';

  constructor(private navCtrl: NavController) {}

  onSubmit(form: NgForm) {
    if (!form.valid) {
      alert('Por favor, preencha todos os campos corretamente.');
      return;
    }

    if (this.password !== this.confirmPassword) {
      alert('As senhas não coincidem!');
      return;
    }

    // Aqui você pode adicionar a lógica para registrar o usuário em seu banco de dados
    alert('Conta criada com sucesso!');

    form.resetForm();
    this.navCtrl.navigateBack('/home'); // Redirecionar para home após cadastro
  }

  goBack() {
    this.navCtrl.back();
  }
}
