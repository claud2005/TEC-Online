import { CommonModule } from '@angular/common';
import { IonicModule, AlertController, ToastController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-administradores',
  templateUrl: './administradores.page.html',
  styleUrls: ['./administradores.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule]
})
export class AdministradoresPage implements OnInit {
  trabalhadores: any[] = [];

  constructor(
    private http: HttpClient,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController
  ) {}

  ngOnInit() {
    this.carregarTrabalhadores();
  }

  carregarTrabalhadores() {
    const token = localStorage.getItem('token');
    const headers = { 'Authorization': `Bearer ${token}` };

    this.http.get<any[]>(`${environment.api_url}/api/trabalhadores`, { headers }).subscribe({
      next: data => this.trabalhadores = data,
      error: err => console.error('Erro ao carregar trabalhadores', err)
    });
  }

  async alterarSenha(trabalhador: any) {
    const alert = await this.alertCtrl.create({
      header: 'Alterar Senha',
      inputs: [
        {
          name: 'novaSenha',
          type: 'password',
          placeholder: 'Nova senha'
        },
        {
          name: 'confirmarSenha',
          type: 'password',
          placeholder: 'Confirmar nova senha'
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Salvar',
          handler: async (dados) => {
            if (dados.novaSenha && dados.novaSenha === dados.confirmarSenha) {
              this.salvarNovaSenha(trabalhador.id, dados.novaSenha);
              return true; // fecha o alert
            } else {
              const toast = await this.toastCtrl.create({
                message: 'As senhas não coincidem.',
                duration: 2000,
                color: 'danger',
                position: 'top'
              });
              await toast.present();
              return false; // mantém o alert aberto
            }
          }
        }
      ]
    });

    await alert.present();
  }

  async salvarNovaSenha(id: string, novaSenha: string) {
    const token = localStorage.getItem('token');
    const headers = { 'Authorization': `Bearer ${token}` };

    this.http.patch(`${environment.api_url}/api/trabalhadores/${id}/senha`, { senha: novaSenha }, { headers })
      .subscribe({
        next: async () => {
          const toast = await this.toastCtrl.create({
            message: 'Senha alterada com sucesso!',
            duration: 2000,
            color: 'success',
            position: 'top'
          });
          toast.present();
        },
        error: async () => {
          const toast = await this.toastCtrl.create({
            message: 'Erro ao alterar a senha.',
            duration: 2000,
            color: 'danger',
            position: 'top'
          });
          toast.present();
        }
      });
  }

  async eliminarTrabalhador(id: string) {
    const alert = await this.alertCtrl.create({
      header: 'Confirmação',
      message: 'Tem certeza que deseja eliminar este trabalhador?',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Eliminar',
          handler: () => {
            const token = localStorage.getItem('token');
            const headers = { 'Authorization': `Bearer ${token}` };

            this.http.delete(`${environment.api_url}/api/trabalhadores/${id}`, { headers }).subscribe({
              next: async () => {
                const toast = await this.toastCtrl.create({
                  message: 'Trabalhador eliminado com sucesso.',
                  duration: 2000,
                  color: 'success',
                  position: 'top'
                });
                toast.present();
                this.carregarTrabalhadores();
              },
              error: async () => {
                const toast = await this.toastCtrl.create({
                  message: 'Erro ao eliminar trabalhador.',
                  duration: 2000,
                  color: 'danger',
                  position: 'top'
                });
                toast.present();
              }
            });
          }
        }
      ]
    });
    await alert.present();
  }
}
