import {
  animate,
  group,
  query,
  style,
  transition,
  trigger,
} from '@angular/animations';

export const routeAnimations = trigger('routeAnimations', [
  transition('* <=> *', [
    query(':enter, :leave', style({ position: 'absolute', width: '93.7%' }), {
      optional: true,
    }),
    group([
      query(
        ':leave',
        [style({ opacity: 1 }), animate('100ms ease', style({ opacity: 0 }))],
        { optional: true }
      ),
      query(
        ':enter',
        [
          style({ transform: 'translateY(20%)', opacity: 0 }),
          animate(
            '200ms ease',
            style({ transform: 'translateY(0)', opacity: 1 })
          ),
        ],
        { optional: true }
      ),
    ]),
  ]),
]);
