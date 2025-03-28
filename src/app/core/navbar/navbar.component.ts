import { Component } from '@angular/core';
import { IconFontAwesomeService } from '../../services/icon-font-awesome.service';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'sb-navbar',
  imports: [CommonModule, FontAwesomeModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {

  constructor(
    public iconService: IconFontAwesomeService,
  ) { }

}
