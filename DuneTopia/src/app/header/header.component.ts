import { Component, OnInit } from '@angular/core';
import { ServicioService } from '../servicio.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  constructor(private servicio: ServicioService, private router: Router){
    
  }
  ngOnInit(): void {
    this.getCantidad()
    this.getLogueo()
  }

  cantidadProductosCarrito: number = 0;
  carritoConteniente: boolean = false;
  estaLogueado: boolean = false;
  isAdmin: boolean = false;

  getCantidad(){
    this.servicio.getCantidadCarrito(1).then(cantidad => {
      this.cantidadProductosCarrito = cantidad;
      this.carritoConteniente = this.cantidadProductosCarrito>0;
    });
  }

  async getLogueo(){
    let usuarioID = localStorage.getItem("ID") || sessionStorage.getItem("ID") || '';

    if(usuarioID !== ''){
      this.estaLogueado = true;

      try{
        const user = await this.servicio.getUserInfo(usuarioID);

        if(user){
          this.isAdmin = user.isAdmin === true;
          console.log('Logueo:', this.estaLogueado);
          console.log('Administrador:', this.isAdmin);
        } else {
          this.isAdmin = false;
          console.log('Logueo:', this.estaLogueado);
        }
      } catch(error){
        console.error('Fallo en la adquisición de los datos de usuario:', error);
      }
    }
  }
  negacionAcceso(){
    if (!this.estaLogueado){
      alert("Inicia Sesión");
      this.router.navigate(['/logueo']);
    }
  }
}
