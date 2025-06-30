import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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
  administradores = [
    { id: '1', nome: 'João Silva', email: 'joao@example.com', telefone: '912345678', isAdmin: true },
    { id: '2', nome: 'Maria Santos', email: 'maria@example.com', telefone: '987654321', isAdmin: false }
  ];

  ngOnInit() {}

  criarAdministrador() {}
  sair() {}
  alterarSenha(admin: any) {}
  eliminarAdministrador(id: string) {}
}
