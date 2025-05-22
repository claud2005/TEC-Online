import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import jsPDF from 'jspdf';
import { environment } from 'src/environments/environment';

interface Servico {
  numero: string;
  data: string;
  status: string;
  cliente: string;
  descricao: string;
  responsavel: string;
  observacoes: string;
  expandido: boolean;
  autorServico: string;
  nomeCompletoCliente: string;
  contatoCliente: string;
  modeloAparelho: string;
  marcaAparelho: string;
  problemaRelatado: string;
  solucaoInicial: string;
  valorTotal: string;
  dataConclusao?: string;
  custoEstimado?: string;
}

@Component({
  selector: 'app-servicos',
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule],
  templateUrl: './servicos.page.html',
  styleUrls: ['./servicos.page.scss'],
})
export class ServicosPage implements OnInit {
  servicos: Servico[] = [];
  filtroStatus: string = 'todos';
  searchTerm: string = '';
  servicosFiltrados: Servico[] = [];

  constructor(
    private router: Router,
    private alertController: AlertController,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.carregarServicos();
  }

  formatarData(data: string): string {
    const date = new Date(data);
    if (isNaN(date.getTime())) {
      return 'Data inválida';
    }
    if (data.includes('T')) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      return `${year}-${month}-${day} ${hours}:${minutes}`;
    } else {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day} 00:00`;
    }
  }

  formatarIdServico(id: string): string {
    return id.padStart(3, '0');
  }

  carregarServicos() {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.get<Servico[]>(`${environment.api_url}/api/servicos`, { headers }).subscribe(
      (response) => {
        console.log('Serviços recebidos da API:', response);
        this.servicos = response.map((servico, index) => ({
          ...servico,
          numero: this.formatarIdServico((index + 1).toString()),
          data: this.formatarData(servico.data)
        }));
        this.filtrarServicos();
        console.log('Serviços carregados:', this.servicos);
      },
      (error) => {
        console.error('Erro ao carregar serviços:', error);
        alert('Erro ao carregar serviços.');
      }
    );
  }

  gerarPDF(servico: Servico) {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('Detalhes do Serviço', 10, 10);
    doc.setFontSize(12);

    doc.text(`Número: ${servico.numero}`, 10, 20);
    doc.text(`Cliente: ${servico.nomeCompletoCliente}`, 10, 30);
    doc.text(`Contacto: ${servico.contatoCliente}`, 10, 50);
    doc.text(`Modelo do Aparelho: ${servico.modeloAparelho}`, 10, 60);
    doc.text(`Marca do Aparelho: ${servico.marcaAparelho}`, 10, 70);
    doc.text(`Problema Relatado: ${servico.problemaRelatado}`, 10, 90);
    doc.text(`Solução Inicial: ${servico.solucaoInicial}`, 10, 100);
    doc.text(`Valor Total: € ${parseFloat(servico.valorTotal).toFixed(2)}`, 10, 110);
    doc.text(`Descrição: ${servico.descricao}`, 10, 120);
    doc.text(`Responsável: ${servico.responsavel}`, 10, 130);
    doc.text(`Observações: ${servico.observacoes}`, 10, 140);

    if (servico.dataConclusao) doc.text(`Data de Conclusão: ${servico.dataConclusao}`, 10, 150);
    if (servico.custoEstimado) doc.text(`Custo Estimado: R$ ${parseFloat(servico.custoEstimado).toFixed(2)}`, 10, 160);

    doc.save(`Servico_${servico.numero}.pdf`);
  }

  filtrarServicos() {
    this.servicosFiltrados = this.servicos.filter(servico => {
      const matchStatus = this.filtroStatus === 'todos' || servico.status === this.filtroStatus;
      const matchSearch = servico.cliente.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                          servico.descricao.toLowerCase().includes(this.searchTerm.toLowerCase());
      return matchStatus && matchSearch;
    });
  }

  voltarParaPlanoSemanal() {
    this.router.navigate(['/plano-semanal']);
  }

  toggleDetalhes(servico: Servico) {
    servico.expandido = !servico.expandido;
  }

  editarServico(servico: any) {
    console.log("ID do serviço sendo passado:", servico._id);
    this.router.navigate(['/editar-servicos', servico._id]);
  }
}
