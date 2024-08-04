import { Component, inject } from '@angular/core';
import { HeroComponent } from '../../shared/hero/hero.component';
import { ActivatedRoute, ResolveFn, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ArticleComponent, ArticleSection } from '../../article/article.component';
import { StrapiImage } from '../../shared/shared-types';
import { StrapiService } from '../../services/strapi.service';
import { TeamMember, TeammemberTileComponent } from './teammember-tile/teammember-tile.component';
import { forkJoin } from 'rxjs';
import { SubmissionService } from '../../services/submission.service';
import { AnimalArticleService } from '../../services/animal-article.service';


export type ContactData = {
  pageData: {
    hero: StrapiImage,
    article: ArticleSection[],
  },
  teamMembers: TeamMember[],
}


export const contactResolver: ResolveFn<ContactData> = () => {
  return forkJoin({
    pageData:   inject(AnimalArticleService).getAndInsertAnimalLinks<{hero: StrapiImage,article: ArticleSection[],}>
    ("contact-page?populate[hero]=*&populate[article][populate]=*"),
    teamMembers: inject(StrapiService).get<TeamMember[]>
    ("teammembers?populate=*"),
  })
}

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [HeroComponent, ArticleComponent, TeammemberTileComponent, RouterLink],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss'
})
export class ContactComponent {
  contactData!: ContactData;

  submissionSv = inject(SubmissionService);

  constructor() {
    inject(ActivatedRoute).data.pipe(takeUntilDestroyed())
    .subscribe( ({ contactData }) => {
      this.contactData = contactData;
    }
  );
}

  sendSubmission() {
    const response = this.submissionSv.postSubmission({
      name: "Simon",
      context: "Lola",
      mail: "simonstoschu@gmail.com",
      message: "Ich hätte die schon gerne pls",
      type: "bewerbung",
      phone: "017622998434"
    })
    console.log(response);
  }
}
