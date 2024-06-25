import { Component, Input, inject } from '@angular/core';
import { ArticleAnimalCardsSection } from '../article-section-types';
import { Animal } from '../../../shared/shared-types';
import { StrapiService } from '../../../services/strapi.service';
import { Observable, map } from 'rxjs';
import { AnimalTileComponent  } from '../../../shared/animal-tile/animal-tile.component';
import { AsyncPipe } from '@angular/common';
import { StrapiRichTextPipe } from '../strapi-rich-text.pipe';

@Component({
  selector: 'app-animal-cards-section',
  standalone: true,
  imports: [AnimalTileComponent, AsyncPipe, StrapiRichTextPipe],
  templateUrl: './animal-cards-section.component.html',
  styleUrl: './animal-cards-section.component.scss'
})
export class AnimalCardsSectionComponent {
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
