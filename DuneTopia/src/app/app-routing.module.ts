import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InicioComponent } from './inicio/inicio.component';
import { RegistroComponent } from './registro/registro.component';
import { LogueoComponent } from './logueo/logueo.component';
import { CarritoComponent } from './carrito/carrito.component';
import { CatalogComponent } from './catalog/catalog.component';
import { DetalleProductoComponent } from './detalle-producto/detalle-producto.component';
import { CompraComponent } from './compra/compra.component';
import { PerfilComponent } from './perfil/perfil.component';
import { AdminComponent } from './admin/admin.component';

const routes: Routes = [
    {path: 'home', component: InicioComponent},
    {path: 'logueo', component: LogueoComponent},
    {path: 'registro', component: RegistroComponent},
    {path: 'carrito', component: CarritoComponent},
    {path: 'catalogo', component: CatalogComponent},
    {path: 'detalle-producto/:id', component: DetalleProductoComponent},
    {path: 'compra', component: CompraComponent},
    {path: 'perfil', component: PerfilComponent},
    {path: 'admin', component: AdminComponent},
    {path: '', redirectTo:'/home', pathMatch:'full'},
    {path: '**', redirectTo:'/home'},

];

@NgModule({
    imports:[RouterModule.forRoot(routes)],
    exports:[RouterModule]
})

export class AppRoutingModule { }