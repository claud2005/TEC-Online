import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IonicModule, LoadingController, AlertController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ClienteService } from '../services/cliente.service';

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

  constructor(
    private route: ActivatedRoute,
    private clienteService: ClienteService,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController
  ) {}

  ngOnInit() {
    this.clienteId = this.route.snapshot.paramMap.get('id');
    if (this.clienteId) {
      this.carregarCliente(this.clienteId);
      this.carregarOrcamentos(this.clienteId);
    }
  }

  async carregarCliente(clienteId: string) {
    const loading = await this.loadingCtrl.create({ message: 'Carregando cliente...' });
    await loading.present();

    this.clienteService.obterClientePorId(clienteId).subscribe({
      next: (cliente) => {
        this.cliente = cliente;
        loading.dismiss();
      },
      error: async (err) => {
        console.error(err);
        loading.dismiss();
        const alert = await this.alertCtrl.create({
          header: 'Erro',
          message: 'Não foi possível carregar os dados do cliente.',
          buttons: ['OK'],
        });
        await alert.present();
      }
    });
  }

  async carregarOrcamentos(clienteId: string) {
    const loading = await this.loadingCtrl.create({ message: 'Carregando orçamentos...' });
    await loading.present();

    this.clienteService.getOrcamentosPorCliente(clienteId).subscribe({
      next: (orcamentos: any[]) => {
        this.orcamentos = orcamentos;
        loading.dismiss();
      },
      error: async (err) => {
        console.error(err);
        loading.dismiss();
        const alert = await this.alertCtrl.create({
          header: 'Erro',
          message: 'Não foi possível carregar os orçamentos.',
          buttons: ['OK'],
        });
        await alert.present();
      }
    });
  }
}
