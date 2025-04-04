import { Categoria } from './Categoria';

export class Productos {
  constructor(
    public id: number | null = null,
    public nameProduct: string | null = null,
    public codigoProducto: string | null = null,
    public descriptionProduct: string | null = null,
    public priceProduct: number | null = null,
    public stockProduct: number | null = null,
    public idCategory: number | null = null,
    public categoryProduct: Categoria | null = null
  ) {}
}
