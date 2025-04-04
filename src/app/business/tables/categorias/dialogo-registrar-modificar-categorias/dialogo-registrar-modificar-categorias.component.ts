// dialogo-registrar-modificar-categoria.component.ts
import {
  Component,
  ElementRef,
  HostListener,
  Inject,
  OnInit,
  ViewChild,
} from '@angular/core';
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
  @ViewChild('nombreInput') nombreInput!: ElementRef<HTMLInputElement>;
  @ViewChild('descripcionInput')
  descripcionInput!: ElementRef<HTMLInputElement>;

  categoriaForm!: FormGroup;
  accion: 'Registrar' | 'Modificar';
  mensaje: string = '';
  esExito: boolean = false;
  estaProcesando: boolean = false;

  constructor(
    private readonly fb: FormBuilder,
    public dialogRef: MatDialogRef<DialogoRegistrarModificarCategoriaComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: { categoria: Categoria; accion: 'Registrar' | 'Modificar' }
  ) {
    this.accion = data.accion;
  }
  // Métodos modificados
  focusNextField(nextField: HTMLInputElement): void {
    nextField.focus();
  }

  focusPreviousField(prevField: HTMLInputElement): void {
    prevField.focus();
  }

  onNombreKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter' || event.key === 'ArrowDown') {
      event.preventDefault();
      this.descripcionInput.nativeElement.focus();
    }
  }

  onDescripcionKeyDown(event: KeyboardEvent) {
    if (event.key === 'ArrowUp') {
      event.preventDefault();
      this.nombreInput.nativeElement.focus();
    } else if (event.key === 'Enter') {
      this.guardar();
    }
  }

  ngOnInit(): void {
    this.inicializarFormulario();
  }
  @HostListener('document:keydown.enter', ['$event'])
  onEnterPress(event: KeyboardEvent): void {
    if (
      event.target instanceof HTMLInputElement &&
      event.target.id !== 'clave'
    ) {
      event.preventDefault();
    }
  }
  inicializarFormulario(): void {
    this.categoriaForm = this.fb.group({
      id: [this.data.categoria?.id ?? null],
      nameCategory: [
        this.data.categoria?.nameCategory ?? '',
        [
          Validators.required,
          Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/),
          Validators.minLength(3),
        ],
      ],
      descriptionCategory: [
        this.data.categoria?.descriptionCategory ?? '',
        [Validators.required, Validators.minLength(5)],
      ],
    });
  }

  guardar(): void {
    this.categoriaForm.markAllAsTouched();

    if (this.categoriaForm.invalid) {
      this.mensaje = 'Por favor complete todos los campos obligatorios';
      this.esExito = false;
      return;
    }

    this.estaProcesando = true;
    const categoria = this.categoriaForm.value;

    this.mensaje =
      this.accion === 'Registrar'
        ? '✅ ¡Categoría agregada correctamente! Redirigiendo...'
        : '✅ ¡Categoría modificada correctamente! Redirigiendo...';
    this.esExito = true;

    setTimeout(() => {
      this.dialogRef.close(categoria);
      this.estaProcesando = false;
    }, 2500); // 3 segundos de espera
  }
}
