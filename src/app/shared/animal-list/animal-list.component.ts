import {Component, DestroyRef, Input, OnInit, inject, Output, EventEmitter} from '@angular/core';
import { AnimalService } from '../../services/animal.service';
import { AsyncPipe } from '@angular/common';
import { AnimalTileComponent } from '../animal-tile/animal-tile.component';
import { Animal } from '../shared-types';
import {BehaviorSubject, debounceTime, Observable, tap} from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-animal-list',
  standalone: true,
  imports: [AsyncPipe, AnimalTileComponent],
  templateUrl: './animal-list.component.html',
  styleUrl: './animal-list.component.scss'
})
export class AnimalListComponent implements OnInit {
  protected animalSv = inject(AnimalService);

  @Input() query$ = new BehaviorSubject<string>("");
  @Input() isVisibleFunction?: (animal: Animal) => boolean;

  @Output() loaded = new EventEmitter<void>();

  protected animals$?: Observable<Animal[]>;
  private destroyRef = inject(DestroyRef);

  filterAnimals(animals: Animal[]) {
    if(!this.isVisibleFunction) return animals;
    return animals.filter((animal) => this.isVisibleFunction!(animal));
  }

  ngOnInit() {
    this.query$
    .pipe(debounceTime(300), takeUntilDestroyed(this.destroyRef))
    .subscribe(query => {
      this.animals$ = this.animalSv.getAnimalList(query).pipe(
        tap(() => this.loaded.emit())
      );
    })
  }
}
