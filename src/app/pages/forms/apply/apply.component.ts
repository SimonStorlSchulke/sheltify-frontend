import { AfterViewInit, Component, ElementRef } from '@angular/core';

@Component({
  selector: 'app-apply',
  standalone: true,
  imports: [],
  templateUrl: './apply.component.html',
  styleUrl: './apply.component.scss'
})
export class ApplyComponent implements AfterViewInit {
 
  ngAfterViewInit() {
    this.generateMessageText()
  }


  generateMessageText() {
    let mailText = "";
    const forms = Array.from(document.querySelectorAll(".form-block"))
    .forEach(formBlock => {
      mailText += `

      ${formBlock.querySelector("label")?.innerText}: ${formBlock.querySelector("input")?.value || '(keine Antwort)'}
      `
    });

    console.log(mailText)
  }

}
