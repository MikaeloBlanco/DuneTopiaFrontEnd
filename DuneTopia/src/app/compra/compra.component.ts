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
          ProductoCarrito.idCarrito==idUsuario
        );
        this.carritoConProductos = products;
        for ( let p of this.carritoConProductos){
          this.getProducto(p.idProducto);
        }
        this.getPrecio();
        console.log(this.carritoConProductos)
      });
    } else {
      alert("Inicia sesión");
      this.router.navigate(['/logueo']);
    }
  }

  getProducto(id:number){
    this.servicioService.getProductos().then(products => {
      products=products.filter((Product) =>
        Product.id == id
      );
      this.carritoDeUsuario.push(products[0]);
      this.precioTotal+=(products[0].precio*this.carritoConProductos[this.contador].cantidad);
      this.contador++;
    });
  }

  async buyProducts(){
    const formData = new FormData();
    formData.append('Precio-total', this.precioTotal.toString());
    formData.append('idUsuario', this.usuarioId);
    let request$ = await this.httpClient.post<Compra>(`${this.API_URL}api/Confirmacion/ComprarProducto`, formData);
    var compra: any = await lastValueFrom(request$);
    console.log(compra);

    const txHash = await this.Compracion(compra);
    const exitoCompra = await this.servicioService.post(`api/Confirmacion/check/${compra.id}`, JSON.stringify(txHash));
    console.log('Transación realizada: ' + exitoCompra)

    const mensajeCompra = exitoCompra
     ? 'Transacción completada con exito'
     : 'Me temo que no se hizo la tranasaccion';

     alert(mensajeCompra)
     if(exitoCompra){
      this.router.navigate(['/']);
     }
  }

  private async Compracion(compra: Compra) : Promise<string>{
    const txHash = await window.compradacion.request({
      method: 'compra_mandarCompra',
      params: [
        {
          from: compra.from,
          to: compra.to,
          value: compra.valor
        }
      ]
    });
    console.log(txHash)
    return txHash;
  }

  async getPrecio(){
    const formData = new FormData();
    formData.append('PrecioTotal', this.precioTotal.toString());

    let request$ = await this.httpClient.post<number>(`${this.API_URL}api/Confirmacion/PrecioEuro`, formData);

    this.precioEuro = await lastValueFrom(request$);
    console.log(lastValueFrom(request$))
  }
}

declare global {
  interface Window{
    compradacion: any;
  }
}
