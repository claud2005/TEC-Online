import { Component, OnInit } from '@angular/core';
import { IonicModule, NavController, AlertController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient, HttpHeaders } from '@angular/common/http';
import { Location } from '@angular/common';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-utilizadores',
  templateUrl: './administradores.page.html',
  styleUrls: ['./administradores.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    HttpClientModule
  ]
})
export class AdministradoresPage implements OnInit {
  utilizadores: any[] = [];

  constructor(
    private http: HttpClient,
    private navCtrl: NavController,
    private location: Location,
    private alertCtrl: AlertController
  ) {}

  ngOnInit() {
    this.carregarUtilizadores();
  }

  ionViewWillEnter() {
    this.carregarUtilizadores();
  }

  carregarUtilizadores() {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.get<any[]>(`${environment.api_url}/api/users`, { headers }).subscribe(
      (data) => {
        this.utilizadores = data.map(user => {
          const atualizado = new Date(user.updatedAt || user.createdAt);
          return {
            id: user._id,
            fullName: user.fullName,
            username: user.username,
            email: user.email,
            isAdmin: user.role === 'admin',
            telefone: user.telefone || '-',
            atualizado: atualizado
          };
        });
      },
      (error) => {
        console.error('Erro ao carregar utilizadores:', error);
      }
    );
  }

  criarUtilizador() {
    this.navCtrl.navigateForward('/signup');
  }

  sair() {
    this.navCtrl.navigateRoot('/plano-semanal');
  }

  alterarSenha(user: any) {
    this.navCtrl.navigateForward(`/esqueceu-password/${user.id}`);
  }

  async confirmarEliminarUtilizador(user: any) {
    const alert = await this.alertCtrl.create({
      header: 'Confirmação',
      message: `Tens certeza que queres eliminar o utilizador ${user.fullName}?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary'
        },
        {
          text: 'Eliminar',
          cssClass: 'danger',
          handler: () => {
            this.eliminarUtilizador(user.id);
          }
        }
      ]
    });

    await alert.present();
  }

  eliminarUtilizador(id: string) {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.delete(`${environment.api_url}/api/users/${id}`, { headers }).subscribe(
      () => {
        console.log(`Utilizador com id ${id} eliminado.`);
        this.carregarUtilizadores();
      },
      (error) => {
        console.error('Erro ao eliminar utilizador:', error);
      }
    );
  }

  editarUtilizador(id: string) {
    this.navCtrl.navigateForward(`/signup/${id}`);
  }
}
