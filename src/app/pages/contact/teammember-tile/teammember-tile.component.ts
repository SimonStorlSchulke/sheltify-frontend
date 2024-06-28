import { Component, Input } from '@angular/core';
import { StrapiImage } from '../../../shared/shared-types';
import { StrapiImagePipe } from "../../../article/article-sections/strapi-image.pipe";

export type TeamMember = {
  name: string,
  role: string,
  description: string,
  mail: string,
  phone: string,
  image: StrapiImage,
}

@Component({
    selector: 'app-teammember-tile',
    standalone: true,
    templateUrl: './teammember-tile.component.html',
    styleUrl: './teammember-tile.component.scss',
    imports: [StrapiImagePipe]
})
export class TeammemberTileComponent {
  @Input({required: true}) teamMember!: TeamMember;
}
