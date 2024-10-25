import { Component, ViewChild, AfterViewInit, ElementRef } from "@angular/core";
import { AuthService } from "src/app/service/auth.service";

@Component({
  selector: 'header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.sass']
})
export class Header {
  @ViewChild('menu') menu?: ElementRef<HTMLImageElement>;
  @ViewChild('close') close?: ElementRef<HTMLImageElement>;
  @ViewChild('nav') nav?: ElementRef<HTMLElement>;
  isLoggedIn: boolean = false;
  userEmail: string | null = null;
  navigations = ['Home', 'About', 'Contact', 'Blog', 'Careers'];

  constructor(private authService: AuthService) { }

  ngOnInit() {
    // Subscribe to authentication status
    this.authService.isAuthenticated.subscribe((isAuth) => {
      this.isLoggedIn = isAuth;
      this.userEmail = isAuth ? this.authService.getUserEmail() : null;
    });
  }

  logout() {
    this.authService.logout();
  }

  protected showMenu() {
    if (this.nav && this.menu && this.close) {
      this.nav.nativeElement.style.opacity = '1';
      this.nav.nativeElement.style.transform = 'translate(-50%, 4.5rem)';
      this.nav.nativeElement.classList.add('active');
      this.menu.nativeElement.style.display = 'none';
      this.close.nativeElement.style.display = 'block';
    }
  }

  protected closeMenu() {
    if (this.nav && this.menu && this.close) {
      this.nav.nativeElement.style.opacity = '';
      this.nav.nativeElement.style.transform = '';
      this.nav.nativeElement.classList.remove('active');
      this.menu.nativeElement.style.display = '';
      this.close.nativeElement.style.display = '';
    }
  }

}
