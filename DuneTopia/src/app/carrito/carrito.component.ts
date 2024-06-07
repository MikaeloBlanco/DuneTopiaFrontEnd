import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ServicioService } from '../servicio.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductoCarrito } from '../model/ProductoCarrito';
import { Product } from '../model/Product';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.component.html',
  styleUrl: './carrito.component.css'
})
export class CarritoComponent implements OnInit{
  constructor(private httpClient: HttpClient, private servicioService: ServicioService, private formBuilder: FormBuilder, private router: Router){
    this.formulario = this.formBuilder.group({
      cantidad:[]
    });
  }
  ngOnInit(): void {
      this.getCarrito();
  }
  formulario: FormGroup;
  API_URL: string = 'https://localhost:7093/';
  carritoConProductos: ProductoCarrito[] = [];
  idUsuario = localStorage.getItem("ID") || sessionStorage.getItem("ID") || '';
  carritoUsuario: Product[] = []
  valoresSpinners: number[] = []
  precioTotal: number = 0;
  contador: number = 0;
  valorSpinner: number = 0;

  getCarrito(){
    var stringIdUsuario = sessionStorage.getItem("ID");
    if(!stringIdUsuario){
      alert("Por favor, Logueese primero");
      this.router.navigate(['/logueo']);
    }
    if(stringIdUsuario){
      const idUsuario = Number.parseInt(stringIdUsuario);
      this.servicioService.getProductosCarrito(idUsuario).then(products => {
        products = products.filter((ProductoCarrito) => ProductoCarrito.idCarrito==idUsuario);
        this.carritoConProductos = products;
        for ( let p of this.carritoConProductos){
          console.log(p.idProducto);
          this.getProducto(p.idProducto);
          console.log("BATMANNNNN")
        }
        console.log(this.carritoConProductos)
      });
    }
  }
  getProducto(id:number){
    this.servicioService.getProductos().then(products => {
      products = products.filter((Product) => Product.id == id);
      this.carritoUsuario.push(products[0]);
      this.precioTotal+=(products[0].precio*this.carritoConProductos[this.contador].cantidad);
      this.valoresSpinners.push(this.carritoConProductos[this.contador].cantidad);
      this.contador++;
    });
  }
  
  async eliminarProducto(productoId : number){
    const formData = new FormData();
    const key = 'idProducto' + productoId.toString();
    formData.append('idProducto', productoId.toString());
    formData.append('idUsuario', this.idUsuario);
    try{
      const request$ = this.httpClient.put<string>(`${this.API_URL}api/CarritoProducto/eliminarProducto/`, formData);
      this.reloadWindowAfterDelay(150);
      await lastValueFrom(request$);
    } catch(error){
      console.log(error);
    }
  }
  async actualizarCantidad(productoId: number, cantidad:number){
    const formData = new FormData();
    formData.append('idProducto', productoId.toString());
    formData.append('idUsuario', this.idUsuario);
    formData.append('cantidad', cantidad.toString());

    try {
      const request$ = this.httpClient.put<string>(`${this.API_URL}api/CarritoProducto/cambiarCantidad`, formData);
      this.reloadWindowAfterDelay(1500);
      await lastValueFrom(request$);
    } catch (error){

    }
  }

  reloadWindowAfterDelay(delay: number){
    setTimeout(() => {
      window.location.reload();
    }, delay)
  }
}
