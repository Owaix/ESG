import { Component, OnDestroy, AfterViewInit } from "@angular/core";

@Component({
  selector: 'footer2',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.sass']
})
export class Footer2 implements AfterViewInit, OnDestroy {
  nav = ['FAQ', 'Terms And Condition', 'Privacy Policy', 'Contact Us', 'Blog'];

  nav2 = [];

  ngAfterViewInit(): void {
    // const svgs = document.getElementsByClassName('icons-social')[0].getElementsByTagName('svg');

    // for (let i = 0; i < svgs.length; i++) {
    //   svgs[i].addEventListener('mouseover', () => {
    //     svgs[i].getElementsByTagName('path')[0].setAttribute('fill', 'var(--lime-green)');
    //   });

    //   svgs[i].addEventListener('mouseout', () => {
    //     svgs[i].getElementsByTagName('path')[0].setAttribute('fill', '#FFF');
    //   });
    // }
  }

  ngOnDestroy(): void {
    const svgs = document.getElementsByClassName('icons-social')[0].getElementsByTagName('svg');

    for (let i = 0; i < svgs.length; i++) {
      svgs[i].removeEventListener('mouseover', () => {});

      svgs[i].removeEventListener('mouseout', () => {});
    }
  }
}
