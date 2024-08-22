import { Component } from '@angular/core';
import { FormsComponent } from '../forms.component';

@Component({
  selector: 'app-apply',
  standalone: true,
  imports: [FormsComponent],
  templateUrl: './apply.component.html',
  styleUrl: './apply.component.scss'
})
export class ApplyComponent {
}
