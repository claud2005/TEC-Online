import { Component, OnInit } from '@angular/core';
import { IonicModule, NavController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment.prod';  // Ajusta caminho se necessário

@Component({
  selector: 'app-utilizadores',
  templateUrl: './administradores.page.html', // Mantém o mesmo html, só muda nome da classe
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

  constructor(private http: HttpClient, private navCtrl: NavController) {}

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
          isAdmin: user.isAdmin || false,
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
    console.log('Criar utilizador - abrir formulário');
    // Aqui podes navegar para página de criação de utilizador ou abrir modal
    // Exemplo:
    // this.navCtrl.navigateForward('/utilizadores-criar');
  }

  sair() {
    console.log('Sair');
    localStorage.removeItem('token');
    this.navCtrl.navigateRoot('/login'); // Ajusta rota para login da tua app
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
        this.carregarUtilizadores(); // Recarrega lista após exclusão
      },
      (error) => {
        console.error('Erro ao eliminar utilizador:', error);
      }
    );
  }
}
