import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsuariosService } from '../../../core/service/TablesServices/usuarios.service';
import { Usuario } from '../../../shared/models/Usuarios';
import { DialogoRegistrarModificarUsuarioComponent } from './dialogo-registrar-modificar-usuario/dialogo-registrar-modificar-usuario.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.scss'],
})
export default class UsuariosComponent implements OnInit {
  usuarios: Usuario[] = [];
  usuariosOriginales: Usuario[] = [];
  terminoBusqueda: string = '';

  constructor(
    private readonly usuariosService: UsuariosService,
    private readonly dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  cargarUsuarios(): void {
    this.usuariosService.getUsuarios().subscribe((data) => {
      this.usuarios = data;
      this.usuariosOriginales = [...data];
    });
  }

  abrirDialogoRegistrar(): void {
    const dialogRef = this.dialog.open(
      DialogoRegistrarModificarUsuarioComponent,
      {
        width: '500px',
        data: {
          usuario: { nombre: '', usuario: '', clave: '' },
          accion: 'Registrar',
        },
      }
    );

    dialogRef.afterClosed().subscribe((nuevoUsuario: Usuario) => {
      if (nuevoUsuario) {
        this.usuariosService.createUsuario(nuevoUsuario).subscribe({
          next: () => {
            this.cargarUsuarios();
          },
        });
      }
    });
  }

  abrirDialogoModificar(usuario: Usuario): void {
    const dialogRef = this.dialog.open(
      DialogoRegistrarModificarUsuarioComponent,
      {
        width: '500px',
        data: { usuario, accion: 'Modificar' },
      }
    );

    dialogRef.afterClosed().subscribe((usuarioEditado: Usuario) => {
      if (usuarioEditado?.id) {
        this.usuariosService
          .updateUsuario(usuarioEditado.id, usuarioEditado)
          .subscribe({
            next: () => this.cargarUsuarios(),
          });
      }
    });
  }

  eliminarUsuario(id: number): void {
    if (confirm('¿Está seguro de eliminar este usuario?')) {
      this.usuariosService.deleteUsuario(id).subscribe({
        next: () => this.cargarUsuarios(),
      });
    }
  }

  filtrarUsuarios(): void {
    if (!this.terminoBusqueda.trim()) {
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
