import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CategoriasService } from '../../../core/service/TablesServices/categorias.service';
import { Categoria } from '../../../shared/models/Categoria';
import { MatDialog } from '@angular/material/dialog';
import { DialogoRegistrarModificarCategoriaComponent } from './dialogo-registrar-modificar-categorias/dialogo-registrar-modificar-categorias.component';

@Component({
  selector: 'app-categorias',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './categorias.component.html',
  styleUrls: ['./categorias.component.scss'],
})
export default class CategoriasComponent implements OnInit {
  categorias: Categoria[] = [];
  categoriasOriginales: Categoria[] = [];
  terminoBusqueda: string = '';

  constructor(
    private readonly categoriasService: CategoriasService,
    private readonly dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.cargarCategorias();
  }

  cargarCategorias(): void {
    this.categoriasService.getCategorias().subscribe((data) => {
      this.categorias = data;
      this.categoriasOriginales = [...data];
    });
  }

  abrirDialogoRegistrar(): void {
    const dialogRef = this.dialog.open(
      DialogoRegistrarModificarCategoriaComponent,
      {
        width: '500px',
        data: {
          categoria: { nombre: '', descripcion: '' },
          accion: 'Registrar',
        },
      }
    );

    dialogRef.afterClosed().subscribe((nuevaCategoria: Categoria) => {
      if (nuevaCategoria) {
        this.categoriasService.createCategoria(nuevaCategoria).subscribe({
          next: () => this.cargarCategorias(),
        });
      }
    });
  }

  abrirDialogoModificar(categoria: Categoria): void {
    const dialogRef = this.dialog.open(
      DialogoRegistrarModificarCategoriaComponent,
      {
        width: '500px',
        data: { categoria, accion: 'Modificar' },
      }
    );

    dialogRef.afterClosed().subscribe((categoriaEditada: Categoria) => {
      if (categoriaEditada?.id) {
        this.categoriasService
          .updateCategoria(categoriaEditada.id, categoriaEditada)
          .subscribe({
            next: () => this.cargarCategorias(),
          });
      }
    });
  }

  eliminarCategoria(id: number): void {
    if (confirm('¿Está seguro de eliminar esta categoría?')) {
      this.categoriasService.deleteCategoria(id).subscribe({
        next: () => this.cargarCategorias(),
      });
    }
  }

  filtrarCategorias(): void {
    if (!this.terminoBusqueda.trim()) {
      this.categorias = [...this.categoriasOriginales];
      return;
    }

    const termino = this.terminoBusqueda.toLowerCase();
    this.categorias = this.categoriasOriginales.filter(
      (categoria) =>
        categoria.descriptionCategory?.toLowerCase().includes(termino) ||
        categoria.nameCategory?.toLowerCase().includes(termino) ||
        categoria.codigoCategory?.toLowerCase().includes(termino) ||
        categoria.id?.toString().includes(termino)
    );
  }
}
