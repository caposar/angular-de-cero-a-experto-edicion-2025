import { Component } from '@angular/core';
import { RouterLinkActive, RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [RouterModule, RouterLinkActive],
  templateUrl: './navbar.component.html',
})
export class NavbarComponent {

}
