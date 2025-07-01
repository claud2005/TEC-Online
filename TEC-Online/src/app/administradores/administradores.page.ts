import { Component, OnInit } from '@angular/core';
import { IonicModule, NavController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient, HttpHeaders } from '@angular/common/http';
import { Location } from '@angular/common';
import { environment } from 'src/environments/environment.prod';  // Ajusta conforme o caminho correto

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
    private location: Location
  ) {}

  ngOnInit() {
    this.carregarUtilizadores();
  }

  carregarUtilizadores() {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.get<any[]>(`${environment.api_url}/api/users`, { headers }).subscribe(
      (data) => {
        this.utilizadores = data.map(user => ({
          id: user._id,
          fullName: user.fullName,
          username: user.username,
          email: user.email,
          isAdmin: user.role === 'admin',  // Corrigido para verificar a role
          telefone: user.telefone || '-'
        }));
        console.log('Utilizadores carregados:', this.utilizadores);
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
    this.location.back();
  }

  alterarSenha(user: any) {
    const novaSenha = prompt(`Digite a nova senha para ${user.fullName}:`);
    if (novaSenha && novaSenha.trim() !== '') {
      const token = localStorage.getItem('token');
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

      this.http.patch(`${environment.api_url}/api/users/${user.id}/password`, { password: novaSenha }, { headers }).subscribe(
        () => alert('Senha alterada com sucesso!'),
        (error) => {
          console.error('Erro ao alterar senha:', error);
          alert('Erro ao alterar senha.');
        }
      );
    }
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
    this.navCtrl.navigateForward(`/signup/${id}`); // Navega para página signup com id para edição
  }
}
