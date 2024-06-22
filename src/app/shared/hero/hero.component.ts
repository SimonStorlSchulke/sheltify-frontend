import { Component, Input } from '@angular/core';
import { StrapiImage } from '../shared-types';
import { StrapiImagePipe } from '../../article/article-sections/strapi-image.pipe';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [StrapiImagePipe],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.scss'
})
export class HeroComponent {
  @Input({required: true}) images!: StrapiImage[]
}
