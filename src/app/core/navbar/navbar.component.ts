import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./style.scss'
  ]
})
export class NavbarComponent {

  
  constructor(public router: Router) {}

  isHomePage(): boolean {
    return this.router.url === '/' || this.router.url === '/home';
  }

}
