import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  getClientes() {
    throw new Error('Method not implemented.');
  }
  private apiUrl = `${environment.api_url}/api/clientes`;

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Token não encontrado.');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  criarCliente(cliente: any): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post(this.apiUrl, cliente, { headers }).pipe(
      catchError(error => {
        console.error('Erro ao criar cliente:', error);
        return throwError(() => new Error(error?.error?.message || 'Erro ao enviar dados.'));
      })
    );
  }

  obterClientes(): Observable<any[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<any[]>(this.apiUrl, { headers }).pipe(
      catchError(error => {
        console.error('Erro ao obter clientes:', error);
        return throwError(() => new Error(error?.error?.message || 'Erro desconhecido.'));
      })
    );
  }

  obterClientePorId(clienteId: string): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get<any>(`${this.apiUrl}/${clienteId}`, { headers }).pipe(
      catchError(error => {
        console.error('Erro ao obter cliente por ID:', error);
        return throwError(() => new Error(error?.error?.message || 'Erro ao obter cliente.'));
      })
    );
  }

  atualizarCliente(clienteId: string, clienteData: any): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.put<any>(`${this.apiUrl}/${clienteId}`, clienteData, { headers }).pipe(
      catchError(error => {
        console.error('Erro ao atualizar cliente:', error);
        return throwError(() => new Error(error?.error?.message || 'Erro ao atualizar cliente.'));
      })
    );
  }

  deletarCliente(clienteId: string): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.delete(`${this.apiUrl}/${clienteId}`, { headers }).pipe(
      catchError(error => {
        console.error('Erro ao excluir cliente:', error);
        return throwError(() => new Error(error?.error?.message || 'Erro ao excluir o cliente.'));
      })
    );
  }

  getOrcamentosPorCliente(clienteId: string): Observable<any[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<any[]>(`${this.apiUrl}/${clienteId}/orcamentos`, { headers }).pipe(
      catchError(error => {
        console.error('Erro ao obter orçamentos do cliente:', error);
        return throwError(() => new Error(error?.error?.message || 'Erro ao obter orçamentos.'));
      })
    );
  }

  getServicosPorCliente(clienteId: string): Observable<any[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<any[]>(`${this.apiUrl}/${clienteId}/servicos`, { headers }).pipe(
      catchError(error => {
        console.error('Erro ao obter serviços do cliente:', error);
        return throwError(() => new Error(error?.error?.message || 'Erro ao obter serviços.'));
      })
    );
  }
}
