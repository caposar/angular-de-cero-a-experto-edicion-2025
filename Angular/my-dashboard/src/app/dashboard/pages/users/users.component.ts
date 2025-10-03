import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { UsersService } from '@services/users.service';
import { TitleComponent } from '@shared/title/title.component';

@Component({
  selector: 'app-users',
  imports: [TitleComponent, RouterLink, RouterLinkActive],
  templateUrl: './users.component.html',
})
export class UsersComponent {
  public usersService = inject(UsersService);
}
