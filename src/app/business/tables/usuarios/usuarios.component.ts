import { Component, OnInit } from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsuariosService } from '../../../core/service/TablesServices/usuarios.service';
import { Usuario } from '../../../shared/models/Usuarios';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [CommonModule, FormsModule, FormsModule],
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.scss'],
})
export default class UsuariosComponent implements OnInit {
  usuarios: Usuario[] = [];
  usuariosOriginales: Usuario[] = [];
  terminoBusqueda: string = '';
  usuarioSeleccionado: Usuario = {
    id: null,
    nombre: '',
    usuario: '',
    clave: '',
  };
  modoEdicion = false;
  mostrarFormulario = false;

  constructor(private usuariosService: UsuariosService) {}

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  cargarUsuarios(): void {
    this.usuariosService.getUsuarios().subscribe({
      next: (data) => {
        this.usuarios = data;
        this.usuariosOriginales = [...data];
      },
      error: (err) => console.error('Error al cargar usuarios', err),
    });
  }

  seleccionarUsuario(usuario: Usuario): void {
    this.usuarioSeleccionado = { ...usuario };
    this.modoEdicion = true;
    this.mostrarFormulario = true;
  }

  nuevoUsuario(): void {
    this.usuarioSeleccionado = { id: null, nombre: '', usuario: '', clave: '' };
    this.modoEdicion = false;
    this.mostrarFormulario = true;
  }

  guardarUsuario(): void {
    if (this.modoEdicion) {
      this.usuariosService
        .updateUsuario(this.usuarioSeleccionado.id!, this.usuarioSeleccionado)
        .subscribe({
          next: () => {
            this.cargarUsuarios();
            this.mostrarFormulario = false;
          },
          error: (err) => console.error('Error al actualizar usuario', err),
        });
    } else {
      this.usuariosService.createUsuario(this.usuarioSeleccionado).subscribe({
        next: () => {
          this.cargarUsuarios();
          this.mostrarFormulario = false;
        },
        error: (err) => console.error('Error al crear usuario', err),
      });
    }
  }

  eliminarUsuario(id: number): void {
    if (confirm('¿Está seguro de eliminar este usuario?')) {
      this.usuariosService.deleteUsuario(id).subscribe({
        next: () => this.cargarUsuarios(),
        error: (err) => console.error('Error al eliminar usuario', err),
      });
    }
  }

  filtrarUsuarios(): void {
    if (!this.terminoBusqueda) {
      this.usuarios = [...this.usuariosOriginales];
      return;
    }

    const termino = this.terminoBusqueda.toLowerCase();
    this.usuarios = this.usuariosOriginales.filter(
      (usuario) =>
        usuario.nombre?.toLowerCase().includes(termino) ||
        usuario.usuario?.toLowerCase().includes(termino) ||
        usuario.id?.toString().includes(termino)
    );
  }
}
