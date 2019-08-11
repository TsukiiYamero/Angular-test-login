import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  showcontent = false;
  constructor(private authS: AuthService,
              private router: Router) {
    this.authS.getDataUser(localStorage.getItem('token')).subscribe(resp => {
      console.log(resp);
      this.showcontent = true;
    }, (error) => {
      this.router.navigateByUrl('/login');
      console.log(error);
    });


  }

  ngOnInit() {
  }

  salir() {
    this.authS.logOut();
    this.router.navigateByUrl('/login');
  }



}
