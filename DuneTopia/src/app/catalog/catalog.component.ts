import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ServicioService } from '../servicio.service';
import { Product } from '../model/Product';

@Component({
  selector: 'app-catalog',
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.css']
})
export class CatalogComponent implements OnInit{
    constructor(private httpClient: HttpClient, private servicioService: ServicioService){

    }

    ngOnInit(): void {
        this.servicioService.getProductos().then(products => {
          this.listaMostrada = products;
          this.listaProductos=this.listaMostrada;
          this.ordenarNombre()
        });
    }

    API_URL: string = 'https://localhost:7143/';
    listaMostrada: Product[] = [];
    listaProductos: Product[] = [];
    orden: number = 0;
    filtroNombre: string='';

    filtrarPorNombre(){
      this.listaMostrada=this.listaProductos.filter((Product) =>
        Product.nombre.toLowerCase().includes(this.filtroNombre.toLowerCase())
      );
    }
    ordenarNombre(){
      this.listaMostrada.sort((a,b) => a.nombre.localeCompare(b.nombre))
    }
    ordenarPrecio(){
      this.listaMostrada.sort((a,b) => a.precio-b.precio)
    }
    ordenarNombreDesc(){
      this.listaMostrada.sort((a,b) => a.nombre.localeCompare(b.nombre))
      this.listaMostrada.reverse()
    }
    ordenarPrecioDesc(){
      this.listaMostrada.sort((a,b) => a.precio-b.precio)
      this.listaMostrada.reverse();
    }
    aplicarFiltros(){
      this.listaMostrada = this.listaProductos;
      this.filtrarPorNombre()
    }
    ordenar(event: Event){
      this.orden = Number((event.target as HTMLSelectElement).value);

      if(this.orden == 0){
        this.ordenarNombre()
      } else if (this.orden == 1) {
        this.ordenarPrecio()
      } else if (this.orden == 2){
        this.ordenarNombreDesc()
      } else {
        this.ordenarPrecioDesc()
      }
    }
}
