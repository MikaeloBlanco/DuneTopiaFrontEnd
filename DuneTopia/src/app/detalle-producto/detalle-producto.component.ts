import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ServicioService } from '../servicio.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subscription, lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-detalle-producto',
  templateUrl: './detalle-producto.component.html',
  styleUrls: ['./detalle-producto.component.css']
})
export class DetalleProductoComponent implements OnInit {

    constructor(
      private rutaActiva: ActivatedRoute,
      private httpClient: HttpClient,
      private servicioService: ServicioService,
      private formBuilder: FormBuilder,
      private router: Router
    ) {
      this.formulario = this.formBuilder.group({
        cantidad: ['1',]
      });
    }
    desuscribir: Subscription | null = null;

    ngOnInit(): void {
        this.desuscribir = this.rutaActiva.params.subscribe((data) => {
          this.id = data['id'];
          this.getProducto();
        })
    }

    API_URL: string = 'https://localhost:7143/';
    detallesProducto: any;
    id: number = 0;
    formulario: FormGroup;
    usuarioId = localStorage.getItem("ID") || sessionStorage.getItem("ID") || '';

    getProducto(){
      this.servicioService.getProductos().then(products => {
        products = products.filter((Product) =>
        Product.id == this.id
        );
        this.detallesProducto = products[0];
      });
    }

    async anadirCarrito(){
      if (this.usuarioId == ''){
        alert("Inicia Sesión");
        this.router.navigate(['/logueo']);
      } else {
        const formData = new FormData();
        const options: any = { responseType:"text" };
        formData.append('idProducto', this.id.toString());
        formData.append('idUsuario', this.usuarioId);
        formData.append('cantidad', this.formulario.get('cantidad')?.value);
        try{
          const request$ = this.httpClient.post<string>(`${this.API_URL}api/Carrito/añadiracarrito/`, formData);
          var event: any = await lastValueFrom(request$);
          alert("Producto añadido con exito")
          window.location.reload();
        } catch (error){
          console.log(event)
        }
      }
    }
}
