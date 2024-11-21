import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';

@Component({
  selector: 'app-support',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatExpansionModule],
  templateUrl: './support.component.html',
  styleUrls: ['./support.component.scss'],
})
export class SupportComponent {
  faqs = [
    {
      question: 'How can I track my order?',
      answer:
        'You can track your order through the "Orders" section in your account.',
    },
    {
      question: 'What is your return policy?',
      answer:
        'We accept returns within 30 days of delivery. Please visit our Returns page for details.',
    },
    {
      question: 'Do you offer customer support?',
      answer:
        'Yes, our customer support is available 24/7. Contact us at support@ecomz.com.',
    },
  ];
}
