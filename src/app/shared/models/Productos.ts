import { Categoria } from './Categoria';

export class Productos {
  constructor(
    public id: number | null = null,
    public nombre: number | null = null,
    public descripcion: number | null = null,
    public precio: number | null = null,
    public stock: number | null = null,
    public idCategoria: number | null = null,
    public categoria: Categoria | null = null
  ) {}
}
