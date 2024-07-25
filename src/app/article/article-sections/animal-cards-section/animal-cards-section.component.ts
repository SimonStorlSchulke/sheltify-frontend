import { Component, Input, OnInit, inject } from '@angular/core';
import { Animal, StrapiImage } from '../../../shared/shared-types';
import { StrapiService } from '../../../services/strapi.service';
import { Observable, map } from 'rxjs';
import { AnimalTileComponent  } from '../../../shared/animal-tile/animal-tile.component';
import { AsyncPipe } from '@angular/common';
import { StrapiRichTextPipe } from '../strapi-rich-text.pipe';
import { RichTextNode } from '../../../services/blockRenderer';

export type ArticleAnimalCardsSection = {
  __component: 'article-section.animal-cards';
  text: RichTextNode[];
  background?: boolean;
  animals: Animal[];
};

@Component({
  selector: 'app-animal-cards-section',
  standalone: true,
  imports: [AnimalTileComponent, AsyncPipe, StrapiRichTextPipe],
  templateUrl: './animal-cards-section.component.html',
  styleUrl: './animal-cards-section.component.scss'
})
export class AnimalCardsSectionComponent implements OnInit {
  @Input({required: true}) sectionData!: ArticleAnimalCardsSection;

  animals$?: Observable<Animal[]>;

  animalSv = inject(StrapiService);

  ngOnInit() {
    const animalIds = this.sectionData.animals.map(a => a.id);

    let query = "?populate=thumbnail";
    for (let i = 0; i < animalIds.length; i++) {
      query += `&filters[id][$in][${i}]=${animalIds[i]}`
    }

    this.animals$ = this.animalSv.get<Animal[]>("animals" + query)
      .pipe(map(unsortedAnimalsList => {
        let sortedAnimals: Animal[] = [];

        for (const id of animalIds) {
          const matchingAnimal = unsortedAnimalsList.find(a => a.id == id);
          if(matchingAnimal) {
            sortedAnimals.push(matchingAnimal)
          }
        }
        return sortedAnimals;
       }));
  }

}
