import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit, AfterViewInit } from '@angular/core';
import { PricePipe } from '../../pipes/price.pipe';

@Component({
  selector: 'sb-landing',
  imports: [CommonModule, PricePipe],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.scss'
})
export class LandingComponent implements OnInit, AfterViewInit {
  products = [
    { id: 1, name: 'Jablko & Škorica', description: 'S vôňou jablka a škorice navodíte do vášho domova pocit pohody a čistoty', price: 14.90, image: 'images/DSC00125.jpg' },
    { id: 2, name: 'Coconut', description: 'Vôňa kokosu vnesie do vášho domova sviežu, exotickú atmosféru', price: 14.90, image: 'images/DSC00088.jpg' },
    { id: 3, name: 'Kvetinová záhrada', description: 'Kvetinová vôňa inšpirovaná rozkvitnutou záhradou prináša do priestoru sviežosť, jemnosť a pocit jari po celý rok', price: 14.90, image: 'images/DSC00093.jpg' },
    { id: 4, name: 'Vanilla', description: 'Jemne sladká vanilka zahalí váš domov do krémovej hebkosti', price: 14.90, image: 'images/DSC00052.jpg' },
    { id: 5, name: 'Ice tea', description: 'Príjemná vôňa ľadového čaju pôsobí sviežo a uvoľňujúco', price: 14.90, image: 'images/DSC00008.jpg' },
  ];

  constructor() {
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
