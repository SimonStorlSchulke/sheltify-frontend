import { Component } from '@angular/core';
import { StrapiImage } from '../shared/shared-types';
import { ArticleSection } from '../article/article-sections/article-section-types';

export type BlogArticle = {
  title: string,
  type: string,
  thumbnail?: StrapiImage,
  description: string,
  article?: ArticleSection[],
  createdAt: Date,
}

@Component({
  selector: 'app-blog',
  standalone: true,
  imports: [],
  templateUrl: './blog.component.html',
  styleUrl: './blog.component.scss'
})
export class BlogComponent {

}
