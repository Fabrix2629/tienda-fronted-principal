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
import { Usuario } from '../../../../shared/models/Usuarios';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-dialogo-registrar-modificar-usuario',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './dialogo-registrar-modificar-usuario.component.html',
  styleUrl: './dialogo-registrar-modificar-usuario.component.scss',
})
export class DialogoRegistrarModificarUsuarioComponent implements OnInit {
  @ViewChild('nombreInput') nombreInput!: ElementRef<HTMLInputElement>;
  @ViewChild('usuarioInput') usuarioInput!: ElementRef<HTMLInputElement>;
  @ViewChild('claveInput') claveInput!: ElementRef<HTMLInputElement>;

  usuarioForm!: FormGroup;
  accion: 'Registrar' | 'Modificar';
  mensaje: string = '';
  esExito: boolean = false;
  estaProcesando: boolean = false;
  constructor(
    private readonly fb: FormBuilder,
    public dialogRef: MatDialogRef<DialogoRegistrarModificarUsuarioComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: { usuario: Usuario; accion: 'Registrar' | 'Modificar' }
  ) {
    this.accion = data.accion;
  }

  ngOnInit(): void {
    this.inicializarFormulario();
  }

  //-----------------------------------------
  //-------MANEJO DE FORMULARIO----------------
  //-----------------------------------------
  // Métodos para navegación
  focusNextField(nextField: HTMLInputElement): void {
    nextField.focus();
  }

  focusPreviousField(prevField: HTMLInputElement): void {
    prevField.focus();
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

  //-----------------------------------------
  //-------MANEJO DE FORMULARIO----------------
  //-----------------------------------------
  inicializarFormulario(): void {
    this.usuarioForm = this.fb.group({
      id: [this.data.usuario?.id ?? null],
      nombre: [
        this.data.usuario?.nombre ?? '',
        [Validators.required, Validators.minLength(3)],
      ],
      usuario: [
        this.data.usuario?.usuario ?? '',
        [
          Validators.required,
          Validators.pattern(/^\S+$/),
          Validators.minLength(4),
          Validators.maxLength(20),
        ],
      ],
      clave: [
        this.data.usuario?.clave ?? '',
        [Validators.required, Validators.minLength(6)],
      ],
    });
  }

  guardar(): void {
    this.usuarioForm.markAllAsTouched();

    if (this.usuarioForm.invalid) {
      this.mensaje = 'Por favor complete todos los campos correctamente';
      this.esExito = false;
      return;
    }

    this.estaProcesando = true;
    this.mensaje =
      this.accion === 'Registrar'
        ? '✅ Usuario registrado correctamente! Redirigiendo...'
        : '✅ Usuario modificado correctamente! Redirigiendo...';
    this.esExito = true;

    setTimeout(() => {
      this.dialogRef.close(this.usuarioForm.value);
      this.estaProcesando = false;
    }, 2000);
  }
}
