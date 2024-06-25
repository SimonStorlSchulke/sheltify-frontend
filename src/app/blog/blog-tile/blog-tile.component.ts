import { Component, Input } from '@angular/core';
import { BlogArticle } from '../blog.component';
import { StrapiImagePipe } from '../../article/article-sections/strapi-image.pipe';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-blog-tile',
  standalone: true,
  imports: [StrapiImagePipe, DatePipe],
  templateUrl: './blog-tile.component.html',
  styleUrl: './blog-tile.component.scss'
})
export class BlogTileComponent {
  @Input({required: true}) blog!: BlogArticle;

}
