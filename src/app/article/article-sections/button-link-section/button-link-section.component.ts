import { Component, Input, inject } from '@angular/core';
import { ButtonLinkSection } from '../article-section-types';
import { StrapiService } from '../../../services/strapi.service';

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
