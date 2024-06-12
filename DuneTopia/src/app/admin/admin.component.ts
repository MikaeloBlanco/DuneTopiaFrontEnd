import { Component, OnInit } from '@angular/core';
import { Usuario } from '../model/usuario';
import { Product } from '../model/Product';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { response } from 'express';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
    usuarioId = localStorage.getItem("ID") || sessionStorage.getItem("ID") || '';
    usuario: Usuario | undefined;
    listaUsuarios: Usuario[] = [];
    listaProductos: Product[] = [];
    API_URL: string = 'https://localhost:7143/';
    formulario: FormGroup;
    mostrarFormularioProducto: boolean = false;
    idProductoSeleccionado: number | null = null;
    ficheroSeleccionado: File | undefined;
    modoEditor: boolean = false;
    
    constructor( private router: Router, private httpClient: HttpClient, private formBuilder: FormBuilder){
      this.formulario = this.formBuilder.group({
        nombre: ['', Validators.required],
        descripcion: ['', Validators.required],
        precio: ['', Validators.required],
        stock: ['', Validators.required],
        file:['']
      });
    }

    ngOnInit(): void {
        this.getListaUsuarios();
        this.getListaProductos();
    }

    toggleFormularioProducto(): void {
      this.mostrarFormularioProducto = !this.mostrarFormularioProducto;
    }

    createProduct(): void {
      if(!this.formulario.valid){
        console.error('Error de registro de formulario. Rellene los campos para poder continuar.');
        return;
      }

      const formData = new FormData();
      formData.append('Nombre', this.formulario.get('nombre')?.value);
      formData.append('Descripcion', this.formulario.get('descripcion')?.value);
      formData.append('Precio', this.formulario.get('precio')?.value);
      formData.append('Stock', this.formulario.get('stock')?.value);
      formData.append('Fichero', this.ficheroSeleccionado!);

      this.httpClient.post(`${this.API_URL}api/Producto/crearProducto`, formData).subscribe(
        (response: any) => {
          console.log('Producto creado con exito: ', response)
          this.getListaProductos();
          this.formulario.reset();
        }
      );
    }

    guardarProductoCreado(){
      if (this.idProductoSeleccionado !== null && this.formulario.valid) {
        const formData = new FormData();
        formData.append('Nombre', this.formulario.get('nombre')?.value);
        formData.append('Descripcion', this.formulario.get('descripcion')?.value);
        formData.append('Precio', this.formulario.get('precio')?.value);
        formData.append('Stock', this.formulario.get('stock')?.value);

        this.httpClient.put(`${this.API_URL}api/Producto/modifyProducto/${this.idProductoSeleccionado}`,formData).subscribe(
          (response: any) => {
            console.log('Producto completamente Modificado: ', response);
            this.getListaProductos();
            this.formulario.reset();
            this.idProductoSeleccionado = null;
          }
        );
      }
    }

    getListaUsuarios(){
      this.httpClient.get<Usuario[]>(`${this.API_URL}api/Usuario/listaUsuarios/`).subscribe((data: Usuario[]) => { this.listaUsuarios= data });
    }

    getListaProductos(){
      this.httpClient.get<Product[]>(`${this.API_URL}api/Producto/detalleProducto/`).subscribe((data: Product[]) => { this.listaProductos = data });
    }

    eliminarUsuario(idUsuario: number): void{
      const confirmarEliminacion = window.confirm('¿Deseas eliminar al usuario?');

      if ( confirmarEliminacion ){
        this.httpClient.delete(`${this.API_URL}api/Usuario/eliminarUsuario/${idUsuario}`).subscribe((response:any) =>
        {
          console.log('Usuario completamente eliminado: ', response);
          this.getListaUsuarios();
        });
      }
    }

    editarOGuardarProducto(idProducto: number): void{
      if(this.idProductoSeleccionado === null) {
        this.idProductoSeleccionado = idProducto;
        const productoSeleccionado = this.listaProductos.find(product => product.id === idProducto);

        if(productoSeleccionado){
          this.formulario.patchValue({
            nombre: productoSeleccionado.nombre,
            descipcion: productoSeleccionado.descripcion,
            precio: productoSeleccionado.precio,
            stock: productoSeleccionado.stock
          });
        }
      } else {
        if (this.formulario.valid) {
          const formData = new FormData();
          formData.append('Nombre', this.formulario.get('nombre')?.value);
          formData.append('Descripcion', this.formulario.get('descripcion')?.value);
          formData.append('Precio', this.formulario.get('precio')?.value);
          formData.append('Stock', this.formulario.get('stock')?.value);
          formData.append('Fichero', this.ficheroSeleccionado!);

          this.httpClient.put(`${this.API_URL}api/Producto/modifyProducto/${this.idProductoSeleccionado}`, formData).subscribe(
            (response: any) => {
              console.log('Producto completamente Modificado: ', response);
              this.getListaProductos();
              this.formulario.reset();
              this.idProductoSeleccionado = null;
              alert('El producto ha sido editado completamente');
            }
          )
        }
      }
    }

    onSeleccionFichero(event: any): void{
      this.ficheroSeleccionado = event.target.files[0] as File;
    }
    onSeleccionImagen(event: any, product: Product): void {
      const file = event.target.files[0] as File;
      this.ficheroSeleccionado = file;
    }

    actualizarRolUsuario(idUsuario: number, actualAdmin: boolean):void {
        const confirmarActualizacion = window.confirm('¿Desea actualizar el rol del usuario?');

        if (confirmarActualizacion) {
          this.httpClient.put(`${this.API_URL}api/Usuario/actualizarRolUsuario/${idUsuario}`, !actualAdmin).subscribe(
            (response: any) => {
              console.log('Rol de usuario Actualizado:', response);
              this.getListaUsuarios();
            }
          );
        }
    }
    toggleModoEdicion():void{
      this.modoEditor = ! this.modoEditor;
    }

}
