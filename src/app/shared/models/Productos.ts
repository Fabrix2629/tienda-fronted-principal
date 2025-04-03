import { Categoria } from './Categoria';

export class Productos {
  constructor(
    public id: number | null = null,
    public nameProduct: number | null = null,
    public codigoProducto: number | null = null,
    public descriptionProduct: number | null = null,
    public priceProduct: number | null = null,
    public stockProduct: number | null = null,
    public idCategory: number | null = null,
    public categoryProduct: Categoria | null = null
  ) {}
}
