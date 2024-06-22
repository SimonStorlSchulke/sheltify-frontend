import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { StrapiService } from './strapi.service';
import { Animal, StrapiFilter } from '../shared/shared-types';


@Injectable({
  providedIn: 'root'
})
export class AnimalService extends StrapiService {

  public getAnimalByName(name: string): Observable<Animal> {
    return this.getMany<Animal>(
      `animals?filters[name][$eqi]=${name}`)
      .pipe(map(animals => animals[0]))
  }

  public getAnimalList(filters: string = ""): Observable<Animal[]> {
    let url = `animals?populate=thumbnail&${filters}`;
    return this.getMany<Animal>(url)
  }
}
