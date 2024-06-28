import { Component, inject } from '@angular/core';
import { HeroComponent } from '../../shared/hero/hero.component';
import { ActivatedRoute, ResolveFn } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ArticleComponent, ArticleSection } from '../../article/article.component';
import { StrapiImage } from '../../shared/shared-types';
import { StrapiService } from '../../services/strapi.service';


export type ConveyData = {
  hero: StrapiImage,
  article: ArticleSection[],
}

export const conveyResolver: ResolveFn<ConveyData> = () => {
  return inject(StrapiService).get<ConveyData>("convey-page?populate[hero]=*&populate[article][populate]=*");
}

@Component({
  selector: 'app-convey',
  standalone: true,
  imports: [HeroComponent, ArticleComponent],
  templateUrl: './convey.component.html',
  styleUrl: './convey.component.scss'
})
export class ConveyComponent {
  public conveyData!: ConveyData;

  constructor() {
    inject(ActivatedRoute).data.pipe(takeUntilDestroyed())
    .subscribe( ({ conveyData }) => {
        this.conveyData = conveyData;
      }
    );
  }
}
