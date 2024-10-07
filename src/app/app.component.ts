import { Component, AfterViewInit } from '@angular/core';

@Component({
  selector: 'body',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent implements AfterViewInit {

  ngAfterViewInit(): void {
    const footer = document.getElementsByTagName('footer')[0];

    if (footer) {
      document.addEventListener('scroll', () => {
        this.animation(footer);
      })
    }
  }

  private animation(element: HTMLElement) {
    if (this.isInViewport(element)) {
      element.style.opacity = '1';
    }
  }

  private isInViewport(element: HTMLElement) {
    const rect = element.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      Math.round(rect.bottom) <= (window.innerHeight || document.documentElement.clientHeight)
    );
  }
}
