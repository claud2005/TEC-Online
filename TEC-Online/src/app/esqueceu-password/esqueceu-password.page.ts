import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController, IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders, HttpClientModule } from '@angular/common/http';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-esqueceu-password',
  templateUrl: './esqueceu-password.page.html',
  styleUrls: ['./esqueceu-password.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, HttpClientModule],
})
export class EsqueceuPasswordPage implements OnInit {
  userId: string | null = null;
  novaSenha: string = '';
  confirmarSenha: string = '';

  utilizador: any = null;  // Dados do utilizador para exibir

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private navCtrl: NavController
  ) {}

  ngOnInit() {
    this.userId = this.route.snapshot.paramMap.get('id');
    if (!this.userId) {
      alert('ID do utilizador não fornecido.');
      this.navCtrl.back();
      return;
    }
    this.carregarUtilizador();
  }

  carregarUtilizador() {
    const token = localStorage.getItem('token') || '';
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.get(`${environment.api_url}/api/users/${this.userId}`, { headers })
      .subscribe(
        (data) => {
          this.utilizador = data;
        },
        (error) => {
          console.error('Erro ao carregar utilizador:', error);
          alert('Não foi possível carregar os dados do utilizador.');
          this.navCtrl.back();
        }
      );
  }

  onSubmit() {
    if (!this.novaSenha.trim()) {
      alert('Por favor, insira uma nova senha válida.');
      return;
    }

    if (this.novaSenha !== this.confirmarSenha) {
      alert('As senhas não coincidem.');
      return;
    }

    const token = localStorage.getItem('token') || '';
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.patch(
      `${environment.api_url}/api/users/${this.userId}/password`,
      { password: this.novaSenha },
      { headers }
    ).subscribe(
      () => {
        alert('Senha alterada com sucesso!');
        this.navCtrl.back();
      },
      (error) => {
        console.error('Erro ao alterar senha:', error);
        alert('Erro ao alterar senha.');
      }
    );
  }

  cancelar() {
    this.navCtrl.back();
  }
}
