import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Categoria } from '../../../shared/models/Categoria';

@Injectable({
  providedIn: 'root',
})
export class CategoriasService {
  private apiUrl =
    'http://localhost:8080/api/v1/backend-principal-tienda/categorias';

  constructor(private readonly http: HttpClient) {}

  getCategorias(): Observable<Categoria[]> {
    return this.http.get<Categoria[]>(`${this.apiUrl}`);
  }

  getCategoria(id: number): Observable<Categoria> {
    return this.http.get<Categoria>(`${this.apiUrl}/findById/${id}`);
  }

  createCategoria(categoria: Categoria): Observable<Categoria> {
    return this.http.post<Categoria>(this.apiUrl, categoria);
  }

  updateCategoria(id: number, categoria: Categoria): Observable<Categoria> {
    return this.http.put<Categoria>(`${this.apiUrl}/${id}`, categoria);
  }

  deleteCategoria(id: number, withProducts: boolean = false): Observable<void> {
    const url = withProducts
      ? `${this.apiUrl}/${id}/with-products`
      : `${this.apiUrl}/${id}`;
    return this.http.delete<void>(url);
  }
}
