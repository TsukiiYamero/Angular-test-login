import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UsuarioModel } from '../models/usuario.model';
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
  // esta definido de manera global
})

export class AuthService {
  private url = `https://identitytoolkit.googleapis.com/v1/accounts:`;
  private apikey = `AIzaSyCcwWkIhDmAg9f_t3NC_483e6wL768_V08`;
  // https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=[API_KEY] crear nuevo
  // https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=[API_KEY] entrar
  // https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=[API_KEY] get userinfo
  userToken: string;

  constructor(private httpC: HttpClient) { this.leerToken(); }

  logOut() {
    localStorage.removeItem('token');
  }

  logIn(usuario: UsuarioModel) {
    const authData = {
      ...usuario,
      returnSecureToken: true
    };
    return this.httpC.post(
      `${this.url}signInWithPassword?key=${this.apikey}`,
      authData
    ).pipe(
      map(
        resp => {
          this.saveToken(resp['idToken']);
          return resp;
        }
      )
    );

  }

  nuevoUsuario(usuario: UsuarioModel) {
    const authData = {
      ...usuario,
      returnSecureToken: true
    };

    return this.httpC.post(
      `${this.url}signUp?key=${this.apikey}`,
      authData
    )
      .pipe(
        // Okey diego Aca estoy reciviendo la respuesta
        // ojo no se la e enviado al metodo que la llamo
        // esto es un filtro donde yo elijo si devolver
        // todo, nada, guarda cosas, devolver algunas...
        // es como si ahora la info pasara a ser del map
        // ---------
        // pasamos la peticion por un pipe
        // para que nos permite utilizar un map dentro,
        // el map nos permite obtener la respuesta cuando ya
        // se complete la peticion y el server
        // devuleva la data.
        // este map puede transformar y devolver lo que yo quiera
        // resp = respuesta =>  la misma data no se a creado otra es la misma
        // debo colocar el return y los datos osea resp para que vayan
        // al metodo que invoco la peticion
        // [''] => para obtener algo de una api donde no se sabe sus propiedades

        map(
          resp => {
            this.saveToken(resp['idToken']);
            return resp;
          }
        )
      )
      ;
  }

  private saveToken(token: string) {
    this.userToken = token;
    localStorage.setItem('token', token);
    const hoy = new Date();
    hoy.setSeconds(3600);
    localStorage.setItem('expire', String(hoy.getTime()));
  }

  leerToken() {
    if (localStorage.getItem('token')) {
      this.userToken = localStorage.getItem('token');
    } else {
      this.userToken = '';
    }

  }

  isAutenticathion(): boolean {
    if (this.userToken.length < 2) {
      return;
    }
    const tokenExpira = Number(localStorage.getItem('expire'));
    const hoy = new Date();
    hoy.setTime(tokenExpira);
    if (hoy > new Date()) {
      return true;
    } else {
      return false;
    }
  }

  getDataUser(token) {
    const sendToken = {
      idToken: token
    };

    return this.httpC.post(`${this.url}lookup?key=${this.apikey}`, sendToken);
  }


}
