import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-administradores',
  templateUrl: './administradores.page.html',
  styleUrls: ['./administradores.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    FormsModule
  ]
})
export class AdministradoresPage implements OnInit {
  administradores: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.carregarAdministradores();
  }

  carregarAdministradores() {
    this.http.get<any[]>('http://localhost:3000/api/users').subscribe(
      (data) => {
        // Ajusta os dados para a tabela
        this.administradores = data.map(user => ({
          id: user._id,
          fullName: user.fullName,
          username: user.username,
          email: user.email,
          isAdmin: user.isAdmin || false,
          telefone: user.telefone || '-'  // se existir telefone no seu schema, senão remova
        }));
        console.log('Administradores carregados:', this.administradores);
      },
      (error) => {
        console.error('Erro ao carregar administradores:', error);
      }
    );
  }

  criarAdministrador() {
    // aqui você pode abrir modal ou navegar para a página de cadastro
    console.log('Criar administrador - abrir formulário');
  }

  sair() {
    // lógica para sair / logout
    console.log('Sair');
  }

  alterarSenha(admin: any) {
    console.log('Alterar senha de:', admin);
  }

  eliminarAdministrador(id: string) {
    console.log('Eliminar administrador com id:', id);
    // aqui você chamaria o backend para deletar e atualizar lista
  }
}
