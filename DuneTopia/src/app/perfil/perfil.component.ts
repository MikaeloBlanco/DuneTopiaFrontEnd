import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ServicioService } from '../servicio.service';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Usuario } from '../model/usuario';
import { ProductoPedido } from '../model/ProductoPedido';
import { Product } from '../model/Product';
import { lastValueFrom } from 'rxjs';
import { Pedido } from '../model/Pedido';
import { Compra } from '../model/Compra';



@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.css'
})
export class PerfilComponent implements OnInit {

  constructor(private router: Router, private servicio: ServicioService, private httpClient: HttpClient, private formBuilder: FormBuilder){
    this.myForm = this.formBuilder.group({
      nombre: ['',],
      email: ['',],
      direccion: ['',],
      password: ['',],
    });
  }

  ngOnInit(): void {
      if(this.usuarioId==''){
        alert('Se requiere de iniciar sesión');
        this.router.navigate(['/']);
      }else {
        this.getUsuario()
      }
  }
  usuarioId = localStorage.getItem("ID") || sessionStorage.getItem("ID") || '';
  cambiarDatos: boolean=false;
  usuario: any;
  API_URL: string = 'https://localhost:7093/';
  listaPedidos: ProductoPedido[]=[];
  listaComprasId: string[]=[];
  listaPedidosTotal: Pedido[]=[];
  listaProductosOrdenados: Product[][]=[];
  contador: number = 0;
  myForm: FormGroup;

  async getUsuario(){
    try{
      const request$ = this.httpClient.get<Usuario[]>(`${this.API_URL}api/Usuario/Listausuario/`);
      let lista=await lastValueFrom(request$);

      lista = lista.filter((usuario) =>
      usuario.id.toString() == this.usuarioId);
      this.usuario=lista[0]
    } catch(e:any){}
  }

  async getCompras(){
    const request$ = this.httpClient.get<Compra[]>(`${this.API_URL}api/Compras/compra/`);
    let listaCompras = await lastValueFrom(request$);

    listaCompras=listaCompras.filter((Compra) =>
    Compra.idUsuario.toString()==this.usuarioId);
    this.getPedidos()

    for(let t of listaCompras){
      let compra = t;
      let productos = this.listaPedidos.filter((Product) =>
      Product.idOrden==t.id);
      let pedidoTotal: Pedido = { compra, productos }
      this.listaPedidosTotal.push(pedidoTotal)
      this.listaComprasId.push(t.id.toString())
    }
  }

  async getPedidos(){
    const request$ = this.httpClient.get<ProductoPedido[]>(`${this.API_URL}api/Compras/historialDeProductos/`);
    this.listaPedidos=await lastValueFrom(request$);

    this.listaPedidos = this.listaPedidos.filter((Product) =>
    this.listaComprasId.includes(Product.idOrden.toString()));
    let idCompra: number = this.listaPedidos[0].idOrden;
    for(let p of this.listaPedidos){
      if(idCompra != p.idOrden){
        this.getProductos(this.listaPedidosTotal[this.contador].productos)
        idCompra = p.idOrden
        this.contador++
      }
      this.listaPedidosTotal[this.contador].productos.push(p)
    }
    this.getProductos(this.listaPedidosTotal[this.contador].productos)
  }

  async getProductos(listaPedidos: ProductoPedido[]){
    let lista: Product[]=[];
    for(let p of listaPedidos){
      this.servicio.getProductos().then(products => {
        products=products.filter((Product) => Product.id==p.productoId);
        lista.push(products[0]);
      });
    }
    this.listaProductosOrdenados.push(lista)
  }

  async upload(){
    const formData = new FormData();
    formData.append('nombre', this.myForm.get('nombre')?.value);
    formData.append('email', this.myForm.get('email')?.value);
    formData.append('password', this.myForm.get('password')?.value);
    formData.append('direccion', this.myForm.get('direccion')?.value);
    formData.append('idUsuario',this.usuarioId);

    const request$ = this.httpClient.post<string>(`${this.API_URL}api/Usuario/actualizarUsuario`, formData);
    await lastValueFrom(request$);
    alert('Datos modificados exitosamente.');
    window.location.reload();
  }
}
