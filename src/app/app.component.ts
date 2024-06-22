import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AnimalService } from './services/animal.service';
import { AsyncPipe } from '@angular/common';
import { HeaderComponent } from "./layout/header/header.component";
import { FooterComponent } from './layout/footer/footer.component';

@Component({
    selector: 'app-root',
    standalone: true,
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
    imports: [RouterOutlet, AsyncPipe, HeaderComponent, FooterComponent]
})
export class AppComponent {
  title = 'sheltify-frontend';


}
