import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
})
export class AboutComponent {
  team = [
    { name: 'Jane Doe', role: 'CEO', image: '/assets/team/jane.jpg' },
    { name: 'John Smith', role: 'CTO', image: '/assets/team/john.jpg' },
    { name: 'Mary Johnson', role: 'Designer', image: '/assets/team/mary.jpg' },
  ];
}
