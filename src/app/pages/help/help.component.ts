import { Component, inject } from '@angular/core';
import { HeroComponent } from '../../shared/hero/hero.component';
import { ActivatedRoute, ResolveFn } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ArticleComponent } from '../../article/article.component';
import { StrapiImage } from '../../shared/shared-types';
import { ArticleSection } from '../../article/article-sections/article-section-types';
import { StrapiService } from '../../services/strapi.service';


export type HelpData = {
  hero: StrapiImage,
  article: ArticleSection[],
}

export const helpResolver: ResolveFn<HelpData> = () => {
  return inject(StrapiService).get<HelpData>("help-page?populate[hero]=*&populate[article][populate]=*");
}

@Component({
  selector: 'app-help',
  standalone: true,
  imports: [HeroComponent, ArticleComponent],
  templateUrl: './help.component.html',
  styleUrl: './help.component.scss'
})
export class HelpComponent {
  public helpData!: HelpData;

  constructor() {
    inject(ActivatedRoute).data.pipe(takeUntilDestroyed())
    .subscribe( ({ helpData }) => {
        this.helpData = helpData;
      }
    );
  }
}
