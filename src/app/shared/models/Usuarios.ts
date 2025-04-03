export class Usuario {
  constructor(
    public id: number | null = null,
    public codigo: string | null = null,
    public nombre: string | null = null,
    public usuario: string | null = null,
    public clave: string | null = null
  ) {}
}
