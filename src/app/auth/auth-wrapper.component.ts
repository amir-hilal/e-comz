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
    trigger('routeAnimations', [
      transition('LoginPage <=> RegisterPage', [
        style({ position: 'relative' }),
        query(':enter, :leave', [
          style({
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
          }),
        ]),
        group([
          query(':leave', [
            animate('300ms ease-out', style({ opacity: 0, transform: 'translateX(-100%)' })),
          ]),
          query(':enter', [
            style({ opacity: 0, transform: 'translateX(100%)' }),
            animate('300ms ease-out', style({ opacity: 1, transform: 'translateX(0%)' })),
          ]),
        ]),
      ]),
    ]),
  ],
})
export class AuthWrapperComponent {
  prepareRoute(outlet: RouterOutlet) {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData['animation'];
  }
}
