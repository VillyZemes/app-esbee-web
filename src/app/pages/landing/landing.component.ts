import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { AboutComponent } from "../about/about.component";
import { ShopComponent } from "../shop/shop.component";

@Component({
  selector: 'sb-landing',
  imports: [CommonModule, AboutComponent, ShopComponent],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.scss'
})
export class LandingComponent implements OnInit, AfterViewInit {

  constructor(

  ) {
  }

  ngOnInit(): void {
    // Set CSS variable for accurate viewport height
    this.setViewportHeight();

    // Update viewport height on resize
    window.addEventListener('resize', () => {
      this.setViewportHeight();
    });
  }

  ngAfterViewInit(): void {
  }




  // Fix for mobile browsers viewport height
  private setViewportHeight(): void {
    // First we get the viewport height and we multiply it by 1% to get a value for a vh unit
    const vh = window.innerHeight * 0.01;
    // Then we set the value in the --vh custom property to the root of the document
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  }
}
