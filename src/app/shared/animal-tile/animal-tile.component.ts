import { Component, Input, inject } from '@angular/core';
import { Animal } from '../shared-types';
import { AnimalService } from '../../services/animal.service';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-animal-tile',
  standalone: true,
  imports: [NgIf],
  templateUrl: './animal-tile.component.html',
  styleUrl: './animal-tile.component.scss'
})
export class AnimalTileComponent {

  animalSv = inject(AnimalService);
  @Input({required: true}) animal!: Animal;
}
