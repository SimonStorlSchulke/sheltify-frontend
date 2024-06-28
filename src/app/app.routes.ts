import { Routes } from '@angular/router';
import { AnimalArticleComponent, animalArticleResolver } from './pages/animal-article/animal-article.component';
import { DogsComponent } from './pages/dogs/dogs.component';
import { HomeComponent, homeResolver } from './pages/home/home.component';
import { AboutComponent, aboutResolver } from './pages/about/about.component';
import { NewsComponent, newsResolver } from './pages/news/news.component';
import { HelpComponent, helpResolver } from './pages/help/help.component';
import { ContactComponent, contactResolver } from './pages/contact/contact.component';
import { ConveyComponent, conveyResolver } from './pages/convey/convey.component';
import { ApplyComponent } from './pages/forms/apply/apply.component';

export const routes: Routes = [
    { path: '', component: HomeComponent, resolve: {homeData: homeResolver} },
    { path: 'ueber-uns', component: AboutComponent, resolve: {aboutData: aboutResolver} },
    { path: 'vermittlung', component: ConveyComponent, resolve: {aboutData: conveyResolver} },
    { path: 'helfen', component: HelpComponent, resolve: {helpData: helpResolver} },
    { path: 'tiere/hunde', component: DogsComponent },
    { path: 'news', component: NewsComponent, resolve: {newsData: newsResolver} },
    { path: 'kontakt', component: ContactComponent, resolve: {contactData: contactResolver} },
    { path: 'tierartikel/:name', component: AnimalArticleComponent, resolve: {animalArticle: animalArticleResolver} },
    { path: 'formulare/bewerbung', component: ApplyComponent },
];
