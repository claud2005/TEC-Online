import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router'; // 🔹 Importação do Router

@Component({
  selector: 'app-servicos',
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule],
  templateUrl: './servicos.page.html',
  styleUrls: ['./servicos.page.scss'],
})
export class ServicosPage {
  servicos = [
    { numero: '001', data: '10/01/2024', status: 'ABERTA', cliente: 'João Silva', equipamento: 'Notebook', modelo: 'Dell Inspiron 15' },
    { numero: '002', data: '12/01/2024', status: 'FECHADA', cliente: 'Maria Souza', equipamento: 'Smartphone', modelo: 'Samsung Galaxy S21' },
    { numero: '003', data: '15/01/2024', status: 'ABERTA', cliente: 'Carlos Pereira', equipamento: 'Impressora', modelo: 'HP LaserJet 1020' },
    { numero: '004', data: '17/01/2024', status: 'FECHADA', cliente: 'Ana Costa', equipamento: 'Tablet', modelo: 'iPad Air' },
    { numero: '005', data: '20/01/2024', status: 'ABERTA', cliente: 'Pedro Martins', equipamento: 'Desktop', modelo: 'Lenovo ThinkCentre' }
  ];

  filtroStatus: string = 'todos';
  searchTerm: string = '';
  servicosFiltrados = [...this.servicos];

  constructor(private router: Router) { // 🔹 Injeta o Router no construtor
    this.filtrarServicos();
  }

  filtrarServicos() {
    this.servicosFiltrados = this.servicos
      .filter(servico => {
        const matchStatus = this.filtroStatus === 'todos' || servico.status === this.filtroStatus;
        const matchSearch = servico.cliente.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                            servico.equipamento.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                            servico.modelo.toLowerCase().includes(this.searchTerm.toLowerCase());
        return matchStatus && matchSearch;
      })
      .sort((a, b) => new Date(a.data).getTime() - new Date(b.data).getTime()); // Ordena por data
  }

  voltarParaPlanoSemanal() { 
    this.router.navigate(['/plano-semanal']); // 🔹 Método que leva para "plano-semanal"
  }
}
