import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment.prod';  // Ajuste o caminho se necessário

@Component({
  selector: 'app-administradores',
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
  administradores: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.carregarAdministradores();
  }

  carregarAdministradores() {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.get<any[]>(`${environment.api_url}/api/users`, { headers }).subscribe(
      (data) => {
        this.administradores = data.map(user => ({
          id: user._id,
          fullName: user.fullName,
          username: user.username,
          email: user.email,
          isAdmin: user.isAdmin || false,
          telefone: user.telefone || '-'
        }));
        console.log('Administradores carregados:', this.administradores);
      },
      (error) => {
        console.error('Erro ao carregar administradores:', error);
      }
    );
  }

  criarAdministrador() {
    console.log('Criar administrador - abrir formulário');
    // Aqui você pode navegar para a página de criação ou abrir modal
  }

  sair() {
    console.log('Sair');
    // Implementar logout ou navegação para página de login
  }

  alterarSenha(admin: any) {
    console.log('Alterar senha de:', admin);
    // Implementar funcionalidade para alterar senha do admin
  }

  eliminarAdministrador(id: string) {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.delete(`${environment.api_url}/api/users/${id}`, { headers }).subscribe(
      () => {
        console.log(`Administrador com id ${id} eliminado.`);
        this.carregarAdministradores(); // Recarrega lista após exclusão
      },
      (error) => {
        console.error('Erro ao eliminar administrador:', error);
      }
    );
  }
}
