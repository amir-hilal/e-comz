import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {
  trigger,
  transition,
  style,
  animate,
  query,
  group,
} from '@angular/animations';

@Component({
  selector: 'app-auth-wrapper',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './auth-wrapper.component.html',
  styleUrls: ['./auth-wrapper.component.scss'],
  animations: [
    trigger('switchSectionAnimation', [
      transition('LoginPage => RegisterPage', [
        style({ opacity: 0, transform: 'translateX(100%)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateX(0%)' })),
      ]),
      transition('RegisterPage => LoginPage', [
        style({ opacity: 0, transform: 'translateX(-100%)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateX(0%)' })),
      ]),
    ]),
  ],
})
export class AuthWrapperComponent {
  prepareRoute(outlet: RouterOutlet) {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData['animation'];
  }
}
