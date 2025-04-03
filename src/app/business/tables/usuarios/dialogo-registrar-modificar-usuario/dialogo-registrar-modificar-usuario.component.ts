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
  usuarioForm!: FormGroup;
  accion: 'Registrar' | 'Modificar';

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

  inicializarFormulario(): void {
    this.usuarioForm = this.fb.group({
      id: [this.accion === 'Modificar' ? this.data.usuario.id : null],
      nombre: [this.data.usuario?.nombre ?? '', Validators.required],
      usuario: [this.data.usuario?.usuario ?? '', Validators.required],
      clave: [
        this.data.usuario?.clave,
        this.accion === 'Registrar' ? Validators.required : [],
      ],
    });
  }

  guardar(): void {
    if (this.usuarioForm.valid) {
      const usuario = this.usuarioForm.value;
      if (this.accion === 'Registrar') {
        delete usuario.id;
      }

      this.dialogRef.close(usuario);
    }
  }
}
