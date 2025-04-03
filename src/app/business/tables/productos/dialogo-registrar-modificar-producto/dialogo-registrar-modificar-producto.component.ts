import { Component, Inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { Productos } from '../../../../shared/models/Productos';
import { Categoria } from '../../../../shared/models/Categoria';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { CategoriasService } from '../../../../core/service/TablesServices/categorias.service';

@Component({
  selector: 'app-dialogo-registrar-modificar-producto',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
  ],
  templateUrl: './dialogo-registrar-modificar-producto.component.html',
  styleUrl: './dialogo-registrar-modificar-producto.component.scss',
})
export class DialogoRegistrarModificarProductoComponent implements OnInit {
  productoForm!: FormGroup;
  accion: 'Registrar' | 'Modificar';
  categorias: Categoria[] = [];

  constructor(
    private readonly fb: FormBuilder,
    private readonly categoriasService: CategoriasService,
    public dialogRef: MatDialogRef<DialogoRegistrarModificarProductoComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: { producto: Productos; accion: 'Registrar' | 'Modificar' }
  ) {
    this.accion = data.accion;
  }

  ngOnInit(): void {
    this.cargarCategorias();
    this.inicializarFormulario();
  }

  cargarCategorias(): void {
    this.categoriasService.getCategorias().subscribe((data) => {
      this.categorias = data;
    });
  }

  inicializarFormulario(): void {
    const producto = this.data.producto || new Productos();

    this.productoForm = this.fb.group({
      id: [producto.id],
      nameProduct: [
        producto.nameProduct,
        [Validators.required, Validators.maxLength(100)],
      ],
      codigoProducto: [producto.codigoProducto],
      descriptionProduct: [producto.descriptionProduct],
      priceProduct: [
        producto.priceProduct,
        [Validators.required, Validators.min(0)],
      ],
      stockProduct: [
        producto.stockProduct,
        [Validators.required, Validators.min(0)],
      ],
      categoryProduct: this.fb.group({
        id: [producto.categoryProduct?.id, Validators.required],
      }),
    });
  }

  guardar(): void {
    if (this.productoForm.valid) {
      const formValue = {
        ...this.productoForm.value,
        idCategoria: Number(this.productoForm.value.categoria.id),
        categoria: undefined,
      };

      if (this.accion === 'Registrar') {
        delete formValue.id;
      }

      if (!formValue.idCategoria) {
        return;
      }

      this.dialogRef.close(formValue);
    }
  }
}
