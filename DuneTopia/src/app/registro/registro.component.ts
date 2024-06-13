import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Usuario } from '../model/usuario';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent {
    API_URL: string = 'https://localhost:7143/';

    myForm: FormGroup;
    email: string = '';
    password: string = '';

    Usuarios: Usuario[] = [];

    constructor(private formBuilder: FormBuilder, private httpClient: HttpClient, private router: Router) {
      this.myForm = this.formBuilder.group({
        name: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        password: ['', Validators.required],
        confirmPassword: ['',Validators.required],
        direccion: ['', Validators.required]
      })
    }

    async uploadRegister(){
      const formData = new FormData();
      formData.append('name', this.myForm.get('name')?.value);
      formData.append('email',this.myForm.get('email')?.value);
      formData.append('password', this.myForm.get('password')?.value);
      formData.append('direccion', this.myForm.get('direccion')?.value);

      if(this.myForm.get('confirmPassword')?.value == this.myForm.get('password')?.value){
        const request$ = this.httpClient.post<string>(`${this.API_URL}api/Usuario/registro`, formData);
        await lastValueFrom(request$);

        alert('Registro completado');
        this.router.navigate(['/logueo']);
      } else {
        alert('Registro incorrecto, su contraseña');
      }
    }
}
