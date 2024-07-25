import { Component, Input, inject } from '@angular/core';
import { StrapiService } from '../../../services/strapi.service';

export type ButtonLinkSection = {
  __component: 'article-section.button-link';
  background?: boolean;
  text: string;
  link: string;
  type: 'primary' | 'secondary' | 'call-to-action';
};

@Component({
  selector: 'app-button-link-section',
  standalone: true,
  imports: [],
  templateUrl: './button-link-section.component.html',
  styleUrl: './button-link-section.component.scss'
})
export class ButtonLinkSectionComponent {
  @Input({required: true}) sectionData!: ButtonLinkSection;
}
