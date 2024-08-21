import { Component, inject, SecurityContext } from '@angular/core';
import { MailformService } from '../../services/mailform.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-forms',
  standalone: true,
  imports: [],
  templateUrl: './forms.component.html',
  styleUrl: './forms.component.scss'
})
export class FormsComponent {

  mailFormSv = inject(MailformService);
  sanitizer = inject(DomSanitizer);

  send() {
    const animalName = this.mailFormSv.truncate((document.querySelector("#tiername") as HTMLInputElement).value ||  "(Kein Hundename angegeben)", 35 );
    let mailHtml = `<h2>Es gibt eine neue Bewerbung für ${animalName}</h2><br><br>`;
  
    Array.from(document.querySelectorAll(".form-block"))
      .forEach(formBlock => {
        const question = formBlock.querySelector("label")?.innerText ?? "";
        const answer = formBlock.querySelector("input")?.value || '(keine Antwort)';
        mailHtml += `<strong>${this.sanitizer.sanitize(SecurityContext.HTML, question)}</strong><br><span>${this.sanitizer.sanitize(SecurityContext.HTML, answer)}</span><br><br> `;
      });

    this.mailFormSv.send({
      subject: "Bewerbung für " + animalName,
      content: mailHtml,
    })
  }
}