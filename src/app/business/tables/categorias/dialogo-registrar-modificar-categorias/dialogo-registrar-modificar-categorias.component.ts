// dialogo-registrar-modificar-categoria.component.ts
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
import { Categoria } from '../../../../shared/models/Categoria';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-dialogo-registrar-modificar-categoria',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './dialogo-registrar-modificar-categorias.component.html',
  styleUrl: './dialogo-registrar-modificar-categorias.component.scss',
})
export class DialogoRegistrarModificarCategoriaComponent implements OnInit {
  categoriaForm!: FormGroup;
  accion: 'Registrar' | 'Modificar';

  constructor(
    private readonly fb: FormBuilder,
    public dialogRef: MatDialogRef<DialogoRegistrarModificarCategoriaComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: { categoria: Categoria; accion: 'Registrar' | 'Modificar' }
  ) {
    this.accion = data.accion;
  }

  ngOnInit(): void {
    this.inicializarFormulario();
  }

  inicializarFormulario(): void {
    this.categoriaForm = this.fb.group({
      id: [this.data.categoria?.id ?? null],
      nameCategory: [
        this.data.categoria?.nameCategory ?? '',
        Validators.required,
      ],
      descriptionCategory: [this.data.categoria?.descriptionCategory ?? ''],
    });
  }

  guardar(): void {
    console.log(this.categoriaForm.valid);
    if (this.categoriaForm.valid) {
      const categoria = this.categoriaForm.value;
      if (this.accion === 'Registrar') {
        delete categoria.id;
      }

      this.dialogRef.close(categoria);
    }
  }
}
