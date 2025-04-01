import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Productos } from '../../../shared/models/Productos';
import { ProductosService } from '../../../core/service/TablesServices/producto.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.scss'],
})
export default class ProductosComponent implements OnInit {
  productos: Productos[] = [];
  terminoBusqueda: string = '';
  productosOriginales: Productos[] = [];
  constructor(private readonly productosService: ProductosService) {}

  ngOnInit(): void {
    this.cargarProductos();
  }

  cargarProductos(): void {
    this.productosService.getProductos().subscribe({
      next: (data) => {
        this.productos = data;
        this.productosOriginales = [...data];
      },
      error: (err) => console.error('Error al cargar productos', err),
    });
  }
  filtrarProductos(): void {
    if (!this.terminoBusqueda) {
      this.productos = [...this.productosOriginales];
      return;
    }

    const termino = this.terminoBusqueda.toLowerCase();
    this.productos = this.productosOriginales.filter(
      (producto) =>
        producto.nombre?.toString().toLowerCase().includes(termino) ||
        producto.descripcion?.toString().toLowerCase().includes(termino) ||
        producto.id?.toString().includes(termino) ||
        producto.precio?.toString().includes(termino) ||
        producto.categoria?.nombre?.toString().toLowerCase().includes(termino)
    );
  }
  eliminarProducto(id: number): void {
    if (confirm('¿Está seguro de eliminar este producto?')) {
      this.productosService.deleteProducto(id).subscribe({
        next: () => this.cargarProductos(),
        error: (err) => console.error('Error al eliminar producto', err),
      });
    }
  }
}
