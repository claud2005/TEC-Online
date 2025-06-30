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
  servicos: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private clienteService: ClienteService,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController
  ) {}

  ngOnInit() {
    this.clienteId = this.route.snapshot.paramMap.get('id');
    if (this.clienteId) {
      this.carregarDados(this.clienteId);
    }
  }

  async carregarDados(clienteId: string) {
    const loading = await this.loadingCtrl.create({
      message: 'Carregando dados do cliente...'
    });
    await loading.present();

    try {
      // Carrega dados do cliente
      const [cliente, orcamentos, servicos] = await Promise.all([
        this.clienteService.obterClientePorId(clienteId).toPromise(),
        this.clienteService.getOrcamentosPorCliente(clienteId).toPromise(),
        this.clienteService.getServicosPorCliente(clienteId).toPromise()
      ]);

      this.cliente = cliente;
      this.orcamentos = orcamentos || [];
      this.servicos = servicos || [];
      
      loading.dismiss();
    } catch (error) {
      loading.dismiss();
      const alert = await this.alertCtrl.create({
        header: 'Erro',
        message: 'Não foi possível carregar os dados do cliente.',
        buttons: ['OK'],
      });
      await alert.present();
      console.error('Erro ao carregar dados:', error);
    }
  }

  calcularTotalServicos(orcamento: any): number {
    return orcamento.servicos?.reduce((acc: number, serv: any) => acc + (serv.preco || 0), 0) || 0;
  }

  // Nova função para formatar data
  formatarData(data: string): string {
    return new Date(data).toLocaleDateString('pt-PT');
  }
}