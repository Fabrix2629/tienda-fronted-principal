import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Productos } from '../../../shared/models/Productos';
import { DialogoRegistrarModificarProductoComponent } from './dialogo-registrar-modificar-producto/dialogo-registrar-modificar-producto.component';
import { MatDialog } from '@angular/material/dialog';
import { ProductosService } from '../../../core/service/TablesServices/producto.service';

@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './productos.component.html',
  styleUrl: './productos.component.scss',
})
export default class ProductosComponent implements OnInit {
  productos: Productos[] = [];
  productosOriginales: Productos[] = [];
  terminoBusqueda: string = '';

  constructor(
    private readonly productosService: ProductosService,
    private readonly dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.cargarProductos();
  }

  cargarProductos(): void {
    this.productosService.getProductos().subscribe((data) => {
      this.productos = data;
      this.productosOriginales = [...data];
    });
  }

  abrirDialogoRegistrar(): void {
    const dialogRef = this.dialog.open(
      DialogoRegistrarModificarProductoComponent,
      {
        width: '500px',
        data: {
          producto: {
            nombre: null,
            descripcion: null,
            precio: null,
            stock: null,
            idCategoria: null,
            categoria: { id: null },
          },
          accion: 'Registrar',
        },
      }
    );

    dialogRef.afterClosed().subscribe((nuevoProducto: Productos) => {
      if (nuevoProducto) {
        this.productosService.createProducto(nuevoProducto).subscribe({
          next: () => this.cargarProductos(),
        });
      }
    });
  }

  abrirDialogoModificar(producto: Productos): void {
    const dialogRef = this.dialog.open(
      DialogoRegistrarModificarProductoComponent,
      {
        width: '500px',
        data: { producto, accion: 'Modificar' },
      }
    );

    dialogRef.afterClosed().subscribe((productoEditado: Productos) => {
      if (productoEditado?.id) {
        this.productosService
          .updateProducto(productoEditado.id, productoEditado)
          .subscribe({
            next: () => this.cargarProductos(),
          });
      }
    });
  }

  eliminarProducto(id: number): void {
    if (confirm('¿Está seguro de eliminar este producto?')) {
      this.productosService.deleteProducto(id).subscribe({
        next: () => this.cargarProductos(),
      });
    }
  }

  filtrarProductos(): void {
    if (!this.terminoBusqueda.trim()) {
      this.productos = [...this.productosOriginales];
      return;
    }

    const termino = this.terminoBusqueda.toLowerCase();
    this.productos = this.productosOriginales.filter(
      (producto) =>
        producto.id?.toString().includes(termino) ||
        producto.codigoProducto?.toString().toLowerCase().includes(termino) ||
        producto.nameProduct?.toString().toLowerCase().includes(termino) ||
        producto.descriptionProduct
          ?.toString()
          .toLowerCase()
          .includes(termino) ||
        producto.priceProduct?.toString().toLowerCase().includes(termino) ||
        producto.stockProduct?.toString().toLowerCase().includes(termino) ||
        producto.categoryProduct?.nameCategory?.toLowerCase().includes(termino)
    );
  }
}
