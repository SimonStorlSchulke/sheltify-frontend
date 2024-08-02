import { Component, inject } from '@angular/core';
import { ActivatedRoute, ChildrenOutletContexts, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { HeaderComponent } from "./layout/header/header.component";
import { FooterComponent } from './layout/footer/footer.component';
import { Title } from '@angular/platform-browser';
import { filter, map } from 'rxjs';

@Component({
    selector: 'app-root',
    standalone: true,
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
    imports: [RouterOutlet, AsyncPipe, HeaderComponent, FooterComponent],
})
export class AppComponent {
  title = 'sheltify-frontend';

  router = inject(Router);
  titleSv = inject(Title);
  contexts = inject(ChildrenOutletContexts);

  ngOnInit() {
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        map(() => {
          let route: ActivatedRoute = this.router.routerState.root;
          let routeTitle = '';
          while (route!.firstChild) {
            route = route.firstChild;
          }
          if (route.snapshot.data['title']) {
            routeTitle = route!.snapshot.data['title'];
          }
          return routeTitle;
        })
      )
      .subscribe((title: string) => {
        if(title == "dynamic") {
          return;
        }
        if (title) {
          this.titleSv.setTitle(`${title} | Herzenshunde Griechenland e.V.`);
        } else {
          this.titleSv.setTitle("Herzenshunde Griechenland e.V.");
        }
      });
  }
}
