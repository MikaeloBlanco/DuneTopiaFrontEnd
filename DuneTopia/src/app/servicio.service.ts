import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import {Product} from './model/Product';
import { ProductoCarrito } from './model/ProductoCarrito';
import { Usuario } from './model/usuario';

@Injectable({
  providedIn: 'root'
})
export class ServicioService {

  constructor(private httpClient:HttpClient) { }

  API_URL : string = 'https://localhost:7143/';

  async getProductos(): Promise<Product[]> {
    try {
      const request$ = this.httpClient.get<Product[]>(`${this.API_URL}api/Producto/detalleProducto/`);
      const productos: Product[] = await lastValueFrom(request$);
      return productos;
    } catch(error){
      alert('La base de datos de datos no ha sido inicializada');
      console.log(error);
      return[]
    }
  }

  async getProductosCarrito(usuarioId: number): Promise<ProductoCarrito[]>{
  try {
    const request$ = this.httpClient.get<ProductoCarrito[]>(`${this.API_URL}api/ProductoCarro/productoscarro`);
    const productos: ProductoCarrito[] = await lastValueFrom(request$);
    return productos;
  } catch (error) {
    alert ('Comprueba la consola de la pagina');
    console.log(error);
    return [];
  }
  }
  async post(url: string, data: any): Promise<any> {
    const headers = {'Content-Type': `application/json`};
    let request$ = this.httpClient.post(`${this.API_URL}${url}`,data,{headers});
    return await lastValueFrom(request$);
  }
  async getCantidadCarrito(id: number): Promise<number>{
    return (await this.getProductosCarrito(id)).length
  }
  async getUserInfo (usuarioId: string): Promise<Usuario | null> {
    const request$ = this.httpClient.get<Usuario>(`${this.API_URL}api/Usuario/usuarioinfo/${usuarioId}`);
    return await lastValueFrom(request$)
  }

}
