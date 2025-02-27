import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-servicos',
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule],
  templateUrl: './servicos.page.html',
  styleUrls: ['./servicos.page.scss'],
})
export class ServicosPage {
  servicos = [
    { 
      nome: 'Troca de óleo',
      status: 'ABERTA',
      cliente: 'João Silva',
      marca: 'Toyota',
      modelo: 'Corolla'
    },
    { 
      nome: 'Revisão geral',
      status: 'FECHADA',
      cliente: 'Maria Souza',
      marca: 'Honda',
      modelo: 'Civic'
    },
    { 
      nome: 'Alinhamento e balanceamento',
      status: 'ABERTA',
      cliente: 'Carlos Pereira',
      marca: 'Ford',
      modelo: 'Fusion'
    },
  ];
}
