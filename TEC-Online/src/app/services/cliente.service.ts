import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  private apiUrl = 'http://localhost:3000/api/clientes';

  constructor(private http: HttpClient) {}

  // Método para obter os cabeçalhos de autenticação
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Token não encontrado.');
    }

    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  // Método para criar um cliente
  criarCliente(cliente: any): Observable<any> {
    try {
      const headers = this.getAuthHeaders();
      return this.http.post(this.apiUrl, cliente, { headers }).pipe(
        catchError(error => {
          console.error('Erro ao criar cliente:', error);
          const mensagem = error?.error?.message || 'Erro ao enviar dados.';
          return throwError(() => new Error(mensagem));
        })
      );
    } catch (err) {
      return throwError(() => err);
    }
  }

  // Método para obter todos os clientes
  obterClientes(): Observable<any[]> {
    try {
      const headers = this.getAuthHeaders();
      return this.http.get<any[]>(this.apiUrl, { headers }).pipe(
        catchError(error => {
          console.error('Erro ao obter clientes:', error);
          const mensagem = error?.error?.message || 'Erro ao obter clientes.';
          return throwError(() => new Error(mensagem));
        })
      );
    } catch (err) {
      return throwError(() => err);
    }
  }

  // Método para obter um cliente específico por ID
  obterClientePorId(clienteId: string): Observable<any> {
    try {
      const headers = this.getAuthHeaders();
      return this.http.get<any>(`${this.apiUrl}/${clienteId}`, { headers }).pipe(
        catchError(error => {
          console.error('Erro ao obter cliente por ID:', error);
          const mensagem = error?.error?.message || 'Erro ao obter cliente.';
          return throwError(() => new Error(mensagem));
        })
      );
    } catch (err) {
      return throwError(() => err);
    }
  }

  // Método para atualizar um cliente
  atualizarCliente(clienteId: string, clienteData: any): Observable<any> {
    try {
      const headers = this.getAuthHeaders();
      return this.http.put<any>(`${this.apiUrl}/${clienteId}`, clienteData, { headers }).pipe(
        catchError(error => {
          console.error('Erro ao atualizar cliente:', error);
          const mensagem = error?.error?.message || 'Erro ao atualizar cliente.';
          return throwError(() => new Error(mensagem));
        })
      );
    } catch (err) {
      return throwError(() => err);
    }
  }

  // Método para deletar um cliente
  deletarCliente(clienteId: string): Observable<any> {
    try {
      const headers = this.getAuthHeaders();
      return this.http.delete(`${this.apiUrl}/${clienteId}`, { headers }).pipe(
        catchError(error => {
          console.error('Erro na requisição DELETE:', error);
          const mensagem = error?.error?.message || 'Erro ao excluir o cliente.';
          return throwError(() => new Error(mensagem));
        })
      );
    } catch (err) {
      return throwError(() => err);
    }
  }
}
