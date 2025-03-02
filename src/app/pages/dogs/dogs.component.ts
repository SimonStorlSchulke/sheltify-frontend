import {AfterViewInit, Component, ElementRef, HostListener, inject, ViewChild} from '@angular/core';
import { AnimalService } from '../../services/animal.service';
import { AsyncPipe } from '@angular/common';
import { HeroComponent } from '../../shared/hero/hero.component';
import { Animal, StrapiMedia } from '../../shared/shared-types';
import { ArticleComponent, ArticleSection } from '../../article/article.component';
import { AnimalListComponent } from '../../shared/animal-list/animal-list.component';
import { BehaviorSubject } from 'rxjs';
import { AnimalArticleService } from '../../services/animal-article.service';
import {DogsService} from "./dogs.service";
import { StrapiQueryBuilder } from '../../services/StrapiQueryBuilder';

@Component({
  selector: 'app-dogs',
  standalone: true,
  imports: [AsyncPipe, AnimalListComponent, HeroComponent, ArticleComponent],
  templateUrl: './dogs.component.html',
  styleUrl: './dogs.component.scss',
})
export class DogsComponent {

  initialLoadDone = false;

  onDogsLoaded() {
    window.setTimeout(() => {
      if(!this.initialLoadDone && this.dogsSv.lastSelectedDogId != -1) {
        this.initialLoadDone = true;
        document.getElementById("animal-card-" + this.dogsSv.lastSelectedDogId)?.scrollIntoView()
      }
    }, 10)
  }

  @ViewChild("searchInput") searchInput!: ElementRef<HTMLInputElement>;

  animalSv = inject(AnimalService);
  dogsSv = inject(DogsService);

  query$ = new BehaviorSubject<string>('');

  pageContent$ = inject(AnimalArticleService).getAndInsertAnimalLinks<{
    hero: StrapiMedia;
    article: ArticleSection[];
  }>('dogs-page?populate=*');


  toggleFilter(category: string, key: string) {
    [...this.dogsSv.filters.get(category)!.keys()].forEach((cKey) => {
      if (cKey != key) {
        this.dogsSv.filters.get(category)!.set(cKey, false);
      }
    });
    const oldValue = this.dogsSv.filters.get(category)!.get(key)!;
    this.dogsSv.filters.get(category)!.set(key, !oldValue);
    if (this.query$.value != '') {
      this.query$.next('');
    }
    this.searchInput.nativeElement.value = "";
  }

  resetFilters() {
    for (const category of this.dogsSv.filters.keys()) {
      for (const key of this.dogsSv.filters.get(category)!.keys()) {
        this.dogsSv.filters.get(category)!.set(key, false)
      }
    }
  }

  onSearchTyped(e: string) {
    if (e.length > 1) {

      const query =
        new StrapiQueryBuilder<Animal>()
          .orFilter([
            ["name", "contains", e],
            ["description", "contains", e],
          ]).buildParams();

      this.query$.next(query);
      window.setTimeout(() => {
        this.resetFilters();
      }, 400);
    } else {
      this.query$.next('');
    }
  }

  isFilterActive(category: string, key: string) {
    return this.dogsSv.filters.get(category)!.get(key);
  }

  activeFilter(category: string) {
    for (const key of this.dogsSv.filters.get(category)!.keys()) {
      if (this.dogsSv.filters.get(category)?.get(key)) return key;
    }
    return null;
  }


  getIsVisibleFunction(): (animal: Animal) => boolean {
    return (animal: Animal) => {
      let inGermany = !this.isFilterActive('inGermany', 'inGermany') || this.animalSv.isInGermany(animal);

      let fitsSize = !this.activeFilter('size');
      if (animal.shoulderHeightCm) {
        if (this.isFilterActive('size', 'small') && animal.shoulderHeightCm <= 40) fitsSize = true;
        if (this.isFilterActive('size', 'medium') && animal.shoulderHeightCm > 40 && animal.shoulderHeightCm <= 55) fitsSize = true;
        if (this.isFilterActive('size', 'large') && animal.shoulderHeightCm > 55) fitsSize = true;
      }

      let fitsGender = !this.activeFilter('gender');
      if (this.isFilterActive('gender', 'male') && animal.gender == 'male') fitsGender = true;
      if (this.isFilterActive('gender', 'female') && animal.gender == 'female') fitsGender = true;


      let fitsAge = !this.activeFilter('age');
      if (animal.birthday) {
        const yearsOld = this.animalSv.yearsOld(animal)!;
        if (this.isFilterActive('age', 'young') && yearsOld < 1) fitsAge = true;
        if (this.isFilterActive('age', 'medium') && yearsOld >= 1 && yearsOld < 7) fitsAge = true;
        if (this.isFilterActive('age', 'old') && yearsOld >= 7) fitsAge = true;
      }

      return fitsSize && fitsGender && fitsAge && inGermany;
    };
  }

  getExplainer() {

    const sizeTexts = new Map<string, string>([
      ["small", "mit bis zu 30cm Schulterhöhe"],
      ["medium", "mit 30-55cm Schulterhöhe"],
      ["large", "ab 55cm Schulterhöhe"],
    ]);

    const ageTexts = new Map<string, string>([
      ["young", "im Alter bis zu 12 Monaten"],
      ["medium", "im Alter von 1-6 Jahren"],
      ["old", "ab 7 Jahren"],
    ]);

    const gender = this.activeFilter("gender");
    const genderText = gender ? (gender == "male" ? "Rüden" : "Hündinnen") : "Hunde";
    const sizeText = sizeTexts.get(this.activeFilter("size") ?? "") ?? "";
    const ageText = ageTexts.get(this.activeFilter("age") ?? "") ?? "";
    const inGermanyText = this.isFilterActive('inGermany', 'inGermany') ? "in Deutschland" : "";

    const text = [genderText, inGermanyText, sizeText, ageText].join(" ");
    if(text.trim() == "Hunde") return "";
    return text;
  }
}
