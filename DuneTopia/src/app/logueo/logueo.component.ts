import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-logueo',
  templateUrl: './logueo.component.html',
  styleUrls: ['./logueo.component.css']
})
export class LogueoComponent {
  API_URL: string = 'https://localhost:7143/';

  myForm: FormGroup;
  email: string = '';
  password: string = '';
  
  usuarios: Usuario[] = [];

  constructor(private httpClient: HttpClient, private formBuilder: FormBuilder, private router: Router){
    this.myForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
      infoDump: ['',]
    });
  }

  async uploadCredentials(){
    const formData = new FormData();
    const options: any = {responseType:"text"};
    formData.append('email',this.myForm.get('email')?.value);
    formData.append('password', this.myForm.get('password')?.value);

    try {
      const request$ = this.httpClient.post<string>(`${this.API_URL}api/Usuario/logueo/`, formData,options);
      var event: any = await lastValueFrom(request$);

      alert('Logueo completado');
      event = JSON.parse(event)

      if(this.myForm.get('infoDump')?.value){
        this.setLocal(event.stringToken,event.id);
      } else {
        this.setSession(event.stringToken,event.id);
      }
      this.router.navigate(['/']).then(() => {
        window.location.href = window.location.href;
      });
    } catch(error){
      alert('Datos Incorrectos o no Encontrados');
    }
  }
  setSession(token: string, id:string){
    sessionStorage.setItem("JWT",token);
    sessionStorage.setItem("ID",id);
  }
  setLocal(token: string, id: string){
    localStorage.setItem("JWT",token);
    localStorage.setItem("ID",id);
  }
}
interface Usuario {
  email: string;
  password: string;
}
