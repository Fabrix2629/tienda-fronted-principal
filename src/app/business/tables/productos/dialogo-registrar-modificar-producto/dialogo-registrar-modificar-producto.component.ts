import {
  Component,
  ElementRef,
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
  @ViewChild('nombreInput') nombreInput!: ElementRef<HTMLInputElement>;
  @ViewChild('descripcionInput')
  descripcionInput!: ElementRef<HTMLInputElement>;
  @ViewChild('precioInput') precioInput!: ElementRef<HTMLInputElement>;
  @ViewChild('stockInput') stockInput!: ElementRef<HTMLInputElement>;
  @ViewChild('categoriaSelect') categoriaSelect!: ElementRef<HTMLSelectElement>;
  productoForm!: FormGroup;
  accion: 'Registrar' | 'Modificar';
  categorias: Categoria[] = [];
  mensaje: string = '';
  esExito: boolean = false;
  estaProcesando: boolean = false;
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
  focusNextField(
    nextField:
      | HTMLInputElement
      | HTMLSelectElement
      | HTMLTextAreaElement
      | HTMLElement
  ): void {
    nextField.focus();
  }
  focusPreviousField(prevField: HTMLInputElement | HTMLSelectElement): void {
    prevField.focus();
  }
  // Bloqueo de números en nombre
  filtrarCaracteres(event: KeyboardEvent): void {
    if (/[0-9]/.test(event.key)) {
      event.preventDefault();
    }
  }
  inicializarFormulario(): void {
    this.productoForm = this.fb.group({
      id: [this.data.producto?.id ?? null],
      nameProduct: [
        this.data.producto?.nameProduct ?? '',
        [
          Validators.required,
          Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/),
          Validators.maxLength(100),
        ],
      ],
      descriptionProduct: [
        this.data.producto?.descriptionProduct ?? '',
        [Validators.required, Validators.minLength(10)],
      ],
      priceProduct: [
        this.data.producto?.priceProduct ?? null,
        [Validators.required, Validators.min(0.01)],
      ],
      stockProduct: [
        this.data.producto?.stockProduct ?? null,
        [Validators.required, Validators.min(0)],
      ],
      categoryProduct: this.fb.group({
        id: [
          this.data.producto?.categoryProduct?.id ?? null,
          Validators.required,
        ],
      }),
    });
  }

  guardar(): void {
    this.productoForm.markAllAsTouched();

    if (this.productoForm.invalid) {
      this.mensaje = 'Por favor complete todos los campos correctamente';
      this.esExito = false;
      return;
    }

    this.estaProcesando = true;
    this.mensaje = `✅ Producto ${
      this.accion === 'Registrar' ? 'registrado' : 'modificado'
    } correctamente! ${this.accion === 'Registrar' ? 'Redirigiendo...' : ''}`;
    this.esExito = true;

    setTimeout(() => {
      const formData = {
        ...this.productoForm.value,
        idCategory: Number(this.productoForm.value.categoryProduct.id),
      };

      delete formData.categoryProduct;
      if (this.accion === 'Registrar') {
        delete formData.id;
      }

      this.dialogRef.close(formData);
      this.estaProcesando = false;
    }, 2000);
  }
}
