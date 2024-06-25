import { Component, inject } from '@angular/core';
import { HeroComponent } from '../../shared/hero/hero.component';
import { ActivatedRoute, ResolveFn } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ArticleComponent } from '../../article/article.component';
import { StrapiImage } from '../../shared/shared-types';
import { ArticleSection } from '../../article/article-sections/article-section-types';
import { StrapiService } from '../../services/strapi.service';


export type ContactData = {
  hero: StrapiImage,
  article: ArticleSection[],
}

export const contactResolver: ResolveFn<ContactData> = () => {
  return inject(StrapiService).get<ContactData>("contact-page?populate[hero]=*&populate[article][populate]=*");
}

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [HeroComponent, ArticleComponent],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss'
})
export class ContactComponent {
  public contactData!: ContactData;

  constructor() {
    inject(ActivatedRoute).data.pipe(takeUntilDestroyed())
    .subscribe( ({ contactData }) => {
        this.contactData = contactData;
      }
    );
  }
}
