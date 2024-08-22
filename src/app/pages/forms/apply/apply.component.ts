import { Component, inject } from '@angular/core';
import { FormsComponent } from '../forms.component';
import { MailformService } from '../../../services/mailform.service';
import { FormsModule } from "@angular/forms";

@Component({
  selector: 'app-apply',
  standalone: true,
  imports: [FormsComponent, FormsModule],
  templateUrl: './apply.component.html',
  styleUrl: './apply.component.scss'
})
export class ApplyComponent  {
  
  animalName = "";

  mailFormSv = inject(MailformService);
}
