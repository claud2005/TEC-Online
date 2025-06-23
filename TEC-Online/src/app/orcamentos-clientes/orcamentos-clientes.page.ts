import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-orcamentos-clientes',
  templateUrl: './orcamentos-clientes.page.html',
  styleUrls: ['./orcamentos-clientes.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
})
export class OrcamentosClientesPage implements OnInit {
  clienteId: string | null = null;
  cliente: any = null;
  orcamentos: any[] = [];

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.clienteId = this.route.snapshot.paramMap.get('id');
    this.carregarCliente();
    this.carregarOrcamentos();
  }

  carregarCliente() {
    // Dados simulados — depois pode substituir pelo serviço real
    this.cliente = {
      _id: this.clienteId,
      nome: 'João Silva',
      email: 'joao@email.com'
    };
  }

  carregarOrcamentos() {
    // Lista simulada de orçamentos — substitua depois pelo serviço real
    this.orcamentos = [
      { titulo: 'Orçamento #1', valor: 150.00, data: new Date('2024-05-10') },
      { titulo: 'Orçamento #2', valor: 320.50, data: new Date('2024-06-15') },
      { titulo: 'Orçamento #3', valor: 99.99, data: new Date('2024-06-20') },
    ];
  }
}
