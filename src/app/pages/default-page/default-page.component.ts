import { Component, inject } from '@angular/core';
import { ActivatedRoute, NavigationStart, Router, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ArticleComponent, ArticleSection } from '../../article/article.component';
import { MemberApplicationComponent } from '../forms/member-application/member-application.component';
import { SponsorhipApplicationComponent } from '../forms/sponsorship-application/sponsorship-application.component';
import { filter } from 'rxjs';

export type DefaultPageData = {
  id: number,
  name: string,
  article: ArticleSection[],
  createdAt: Date,
}

@Component({
  selector: 'app-blog',
  standalone: true,
  imports: [ArticleComponent, RouterLink, MemberApplicationComponent, SponsorhipApplicationComponent],
  templateUrl: './default-page.component.html',
  styleUrl: './default-page.component.scss'
})
export class DefaultPageComponent {

  pageData?: DefaultPageData;

  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute)

  route = "";

  constructor() {
    this.activatedRoute.data.pipe(takeUntilDestroyed())
    .subscribe(({ pageData }) => {
        this.route = this.router.url;
        this.pageData = pageData;
      }
      );

  }
}
