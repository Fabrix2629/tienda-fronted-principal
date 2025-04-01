import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoriasService } from '../../../core/service/TablesServices/categorias.service';
import { Categoria } from '../../../shared/models/Categoria';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-categorias',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './categorias.component.html',
  styleUrls: ['./categorias.component.scss'],
})
export default class CategoriasComponent implements OnInit {
  categorias: Categoria[] = [];
  terminoBusqueda: string = '';
  categoriasOriginales: Categoria[] = [];
  constructor(private readonly categoriasService: CategoriasService) {}

  ngOnInit(): void {
    this.cargarCategorias();
  }

  cargarCategorias(): void {
    this.categoriasService.getCategorias().subscribe({
      next: (data) => {
        this.categorias = data;
        this.categoriasOriginales = [...data];
      },
      error: (err) => console.error('Error al cargar categorías', err),
    });
  }

  filtrarCategorias(): void {
    if (!this.terminoBusqueda) {
      this.categorias = [...this.categoriasOriginales];
      return;
    }

    const termino = this.terminoBusqueda.toLowerCase();
    this.categorias = this.categoriasOriginales.filter(
      (categoria) =>
        categoria.nombre?.toString().toLowerCase().includes(termino) ||
        categoria.descripcion?.toString().toLowerCase().includes(termino) ||
        categoria.id?.toString().includes(termino)
    );
  }
  eliminarCategoria(id: number): void {
    if (confirm('¿Está seguro de eliminar esta categoría?')) {
      this.categoriasService.deleteCategoria(id).subscribe({
        next: () => this.cargarCategorias(),
        error: (err) => console.error('Error al eliminar categoría', err),
      });
    }
  }
}
