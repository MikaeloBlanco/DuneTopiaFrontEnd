import { Component, OnInit } from '@angular/core';
import { ServicioService } from '../servicio.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ProductoCarrito } from '../model/ProductoCarrito';
import { Product } from '../model/Product';
import { Router } from '@angular/router';
import { Compra } from '../model/Compra';
import { last, lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-compra',
  templateUrl: './compra.component.html',
  styleUrls: ['./compra.component.css']
})
export class CompraComponent implements OnInit{
  

  ngOnInit(): void {
      this.getCarrito()
  }

  constructor(private servicioService: ServicioService, private formBuilder: FormBuilder, private httpClient: HttpClient, private router: Router) {
    this.formulario = this.formBuilder.group({
      idUsuario: ['', Validators.required],
      precioTotal: ['',Validators.required]
    });
  }

  API_URL: string = 'https://localhost:7143/';
  formulario: FormGroup;
  carritoConProductos: ProductoCarrito[] = [];
  usuarioId = localStorage.getItem("ID") || sessionStorage.getItem("ID") || '';
  carritoDeUsuario: Product[] = [];
  valoresSpinners: number[] = [];
  precioTotal: number = 0;
  precioEuro: number = 0;
  contador: number = 0;
  conversion: number = 0;

  async getCarrito(){
    if (this.usuarioId) {
      const idUsuario = Number.parseInt(this.usuarioId);
      this.servicioService.getProductosCarrito(idUsuario).then(products => {
        products = products.filter((ProductoCarrito) =>
          ProductoCarrito.carroDeCompraId==idUsuario
        );
        this.carritoConProductos = products;
        for ( let p of this.carritoConProductos){
          this.getProducto(p.productoId);
        }
        console.log(this.carritoConProductos)
      });
  }
}

  getProducto(id:number){
    this.servicioService.getProductos().then(products => {
      products=products.filter((Product) =>
        Product.id == id
      );
      this.carritoDeUsuario.push(products[0]);
      this.precioTotal+=(products[0].price*this.carritoConProductos[this.contador].cantidad);
      this.contador++;
    });
  }

  async buyProducts(){
    const formData = new FormData();
    formData.append('totalPrecio', this.precioTotal.toString());
    formData.append('idUsuario', this.usuarioId);
    let request$ = await this.httpClient.post<Compra>(`${this.API_URL}api/Confirmacion/ComprarProducto`, formData);
    var compra: any = await lastValueFrom(request$);
    console.log(compra);
    const exitoCompra = await this.servicioService.post(`api/Confirmacion/check/${compra.id}`, formData);
    console.log('Transación realizada: ' + exitoCompra)

    const mensajeCompra = exitoCompra
     ? 'Transacción completada con exito'
     : 'Me temo que no se hizo la tranasaccion';

     alert(mensajeCompra)
     if(exitoCompra){
      this.router.navigate(['/']);
     }
  }
}

declare global {
  interface Window{
    compradacion: any;
  }
}
