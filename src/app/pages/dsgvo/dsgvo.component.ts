import { Component } from '@angular/core';
import { CookiebannerComponent } from "../../cookiebanner/cookiebanner.component";

@Component({
  selector: 'app-dsgvo',
  standalone: true,
  imports: [CookiebannerComponent],
  templateUrl: './dsgvo.component.html',
  styleUrl: './dsgvo.component.scss'
})
export class DsgvoComponent {
  //TODO über Strapi verwaltbar machen
}
