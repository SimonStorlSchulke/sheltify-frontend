import { Component, Input } from '@angular/core';
import { AltTextPipe } from 'app/pipes/alt-text.pipe';
import { StrapiMedia } from '../shared-types';
import { StrapiMediaPipe } from '../../article/article-sections/strapi-image.pipe';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [StrapiMediaPipe, AltTextPipe],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.scss'
})
export class HeroComponent {
  @Input({required: true}) images!: StrapiMedia[]
}
