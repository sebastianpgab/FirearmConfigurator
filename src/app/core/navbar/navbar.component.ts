import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

interface Category {
  title: string;
  path: string;
}

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./style.scss']
})
export class NavbarComponent {

  menuOpen: boolean = false;
  dropdownOpen: boolean = false;

  categories: Category[] = [
    { title: 'Lufa', path: '/r8/barrel' },
    { title: 'Kolba', path: '/r8/stock' },
    { title: 'Komora zamka', path: '/r8/chamberBolt' },
    { title: 'Akcesoria', path: '/r8/accessories' },
    { title: 'Podsumowanie', path: '/r8/summary' }
  ];

  @ViewChild('dropdownButton') dropdownButton!: ElementRef;

  constructor(public router: Router) {}

  isHomePage(): boolean {
    return this.router.url === '/' || this.router.url === '/home';
  }

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
    if (this.menuOpen) {
      this.dropdownOpen = true; 
    } else {
      this.dropdownOpen = false;
    }
  }

  toggleDropdown(): void {
    this.dropdownOpen = !this.dropdownOpen;
  }

  navigateTo(category: Category): void {
    this.router.navigate([category.path]);
    this.menuOpen = false;
    this.dropdownOpen = false;
  }
}
