import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { UsuarioModel } from '../../models/usuario.model';
import { AuthService } from '../../services/auth.service';

import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  usuarioM: UsuarioModel;
  recordarUsuario = false;

  constructor(private auth: AuthService,
              private router: Router) { }

  ngOnInit() {
    this.usuarioM = new UsuarioModel();
    if (localStorage.getItem('email')) {
      this.usuarioM.email = localStorage.getItem('email');
    }
    this.alreadyUser();
  }


  login(form: NgForm) {
    if (form.invalid) {
      return;
    }

    Swal.fire({
      allowOutsideClick: false,
      type: 'info',
      text: 'Cargando...',

    });
    Swal.showLoading();


    this.auth.logIn(this.usuarioM).subscribe(res => {
      console.log(res);
      Swal.close();
      this.router.navigateByUrl('/home');
      if (this.recordarUsuario) {
        localStorage.setItem('email', this.usuarioM.email);
      }
    }, (error) => {
      Swal.fire({
        allowOutsideClick: true,
        type: 'error',
        title: 'Error al Iniciar Sesion',
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
