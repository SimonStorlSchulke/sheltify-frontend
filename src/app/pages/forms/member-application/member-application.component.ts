import { Component } from '@angular/core';
import { FormsComponent } from '../forms.component';

@Component({
  selector: 'app-member-application',
  standalone: true,
  imports: [FormsComponent],
  templateUrl: './member-application.component.html',
  styleUrl: './member-application.component.scss'
})
export class MemberApplicationComponent {

}
