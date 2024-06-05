import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HeaderComponent } from './header/header.component';
import { PiePaginaComponent } from './Pie-Pagina/pie-pagina.component';
import { AdminComponent } from './admin/admin.component';
import { CarritoComponent } from './carrito/carrito.component';
import { CatalogComponent } from './catalog/catalog.component';
import { CompraComponent } from './compra/compra.component';
import { DetalleProductoComponent } from './detalle-producto/detalle-producto.component';
import { InicioComponent } from './inicio/inicio.component';
import { PerfilComponent } from './perfil/perfil.component';
import { RegistroComponent } from './registro/registro.component';
import { LogueoComponent } from './logueo/logueo.component';

@NgModule({
    declarations: [
        AppComponent,
        HeaderComponent,
        PiePaginaComponent,
        AdminComponent,
        CarritoComponent,
        CatalogComponent,
        CompraComponent,
        DetalleProductoComponent,
        InicioComponent,
        PerfilComponent,
        LogueoComponent,
        RegistroComponent
    ],
    providers: [],
    bootstrap: [AppComponent],
    imports: [
        BrowserModule,
        AppRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
    ]
})
export class AppModule {}