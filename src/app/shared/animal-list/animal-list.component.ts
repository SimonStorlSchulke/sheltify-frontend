import { Component, Input, OnInit, inject } from '@angular/core';
import { AnimalService } from '../../services/animal.service';
import { AsyncPipe } from '@angular/common';
import { AnimalTileComponent } from '../../shared/animal-tile/animal-tile.component';
import { Animal } from '../../shared/shared-types';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-animal-list',
  standalone: true,
  imports: [AsyncPipe, AnimalTileComponent],
  templateUrl: './animal-list.component.html',
  styleUrl: './animal-list.component.scss'
})
export class AnimalListComponent implements OnInit {
  protected animalSv = inject(AnimalService);

  @Input() query: string = "";
  @Input() isVisibleFunction?: (animal: Animal) => boolean;

  protected animals$?: Observable<Animal[]>;

  filterAnimals(animals: Animal[]) {
    if(!this.isVisibleFunction) return animals;
    return animals.filter((animal) => this.isVisibleFunction!(animal));
  }

  ngOnInit() {
    this.animals$ = this.animalSv.getAnimalList(this.query);
  }
}
