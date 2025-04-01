import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Productos } from '../../../shared/models/Productos';

@Injectable({
  providedIn: 'root',
})
export class ProductosService {
  private readonly apiUrl =
    'http://localhost:8080/api/v1/backend-principal-tienda/productos';

  constructor(private readonly http: HttpClient) {}

  getProductos(): Observable<Productos[]> {
    return this.http.get<Productos[]>(`${this.apiUrl}/findAll`);
  }

  getProducto(id: number): Observable<Productos> {
    return this.http.get<Productos>(`${this.apiUrl}/findById/${id}`);
  }

  createProducto(producto: Productos): Observable<Productos> {
    return this.http.post<Productos>(`${this.apiUrl}`, producto);
  }

  updateProducto(id: number, producto: Productos): Observable<Productos> {
    return this.http.put<Productos>(`${this.apiUrl}/${id}`, producto);
  }

  deleteProducto(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
