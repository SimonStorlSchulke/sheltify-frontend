import { Component, HostListener } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

type HeaderItem = {
  label: string,
  link?: string,
  children?: Array<{
    label: string,
    link: string
  }>,
}

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  items: HeaderItem[] = [
    { label: "Home", link: "/" },
    { label: "Über uns", link: "/ueber-uns" },
/*     {
      label: "Tiere", children: [
        { label: "Hunde", link: "/tiere/hunde" },
        { label: "Katzen", link: "/tiere/katzen" },
        { label: "Vögel", link: "/tiere/voegel" },
      ]
    }, */
    { label: "Hunde", link: "/tiere/hunde" },
    { label: "Vermittlung", link: "/vermittlung" },
    { label: "Helfen", link: "/helfen" },
    { label: "News & Wissen", link: "/news" },
    { label: "Kontakt", link: "/kontakt" },
  ]

  openedDropdownIndex: number = -1;
  burgerMenuOpen: boolean = false;

  @HostListener('document:mouseup', ['$event'])
  onClickOutside(event: MouseEvent): void {
    if(this.openedDropdownIndex == -1) return;
    if(!((event.target as HTMLElement).classList.contains("dropdown-index-" + this.openedDropdownIndex))) {
        this.openedDropdownIndex = -1;
        this.burgerMenuOpen = false;
    } else {
    }
  }
}
