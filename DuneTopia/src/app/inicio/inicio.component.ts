import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ServicioService } from '../servicio.service';
import { Product } from '../model/Product';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.css'
})
export class InicioComponent implements OnInit{

  constructor(private httpClient:HttpClient, private servicioService:ServicioService){

  }

  ngOnInit(): void {
      this.servicioService.getProductos().then(products => {
        this.listaProductos = products;
      });
  }

  API_URL: string = 'https://localhost:7093/';
  listaProductos: Product[]=[];
  
}
