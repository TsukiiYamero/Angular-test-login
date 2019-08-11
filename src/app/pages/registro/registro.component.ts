import { Component, OnInit } from '@angular/core';
import { UsuarioModel } from '../../models/usuario.model';
import { NgForm } from '@angular/forms';
import Swal from 'sweetalert2';


import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent implements OnInit {
  usuarioM: UsuarioModel;

  constructor(private auth: AuthService,
              private router: Router) { }

  ngOnInit() {
    this.usuarioM = new UsuarioModel();
    this.alreadyUser();
  }


  onSubmit(form: NgForm) {
    if (form.invalid) {
      return;
    }
    Swal.fire({
      allowOutsideClick: false,
      type: 'info',
      text: 'Enviando tus Datos...',
    });
    Swal.showLoading();
    this.auth.nuevoUsuario(this.usuarioM).subscribe(resp => {
      console.log(resp);
      Swal.close();
      this.router.navigateByUrl('/home');
    }, (error) => {
      Swal.fire({
        allowOutsideClick: true,
        type: 'error',
        title: 'Oopss.. No se pudo crear tu cuenta',
        text: error.error.error.message,

      });
      console.log(error.error.error.message);
    });
  }



  alreadyUser() {
    if (localStorage.getItem('token')) {
      this.auth.getDataUser(localStorage.getItem('token')).subscribe((resp) => {
        console.log('"es verdad existes"');
        this.router.navigateByUrl('/home');
      }, (error) => {
        console.log(error.error.error.message);
      });
    }
  }

}
