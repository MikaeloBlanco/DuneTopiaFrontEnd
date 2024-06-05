import { ProductoPedido } from "./ProductoPedido";
import { Compra } from "./Compra";

export interface Pedido{
    compra: Compra,
    productos: ProductoPedido[]
}