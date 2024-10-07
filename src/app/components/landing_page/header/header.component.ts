import { Component, ViewChild, AfterViewInit, ElementRef } from "@angular/core";

@Component({
  selector: 'header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.sass']
})
export class Header {
  @ViewChild('menu') menu?: ElementRef<HTMLImageElement>;

  @ViewChild('close') close?: ElementRef<HTMLImageElement>;

  @ViewChild('nav') nav?: ElementRef<HTMLElement>;

  navigations = ['Home', 'About', 'Contact', 'Blog', 'Careers'];

  protected showMenu() {
    if (this.nav && this.menu && this.close) {
      this.nav.nativeElement.style.opacity = '1';
      this.nav.nativeElement.style.transform = 'translate(-50%, 4.5rem)';

      this.menu.nativeElement.style.display = 'none';
      this.close.nativeElement.style.display = 'block';
    }
  }

  protected closeMenu() {
    if (this.nav && this.menu && this.close) {
      this.nav.nativeElement.style.opacity = '';
      this.nav.nativeElement.style.transform = '';

      this.menu.nativeElement.style.display = '';
      this.close.nativeElement.style.display = '';
    }
  }
}
