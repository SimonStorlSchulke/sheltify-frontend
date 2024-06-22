import { Routes } from '@angular/router';
import { AnimalArticleComponent } from './pages/animal-article/animal-article.component';
import { DogsComponent } from './pages/dogs/dogs.component';
import { HomeComponent } from './pages/home/home.component';
import { AboutComponent } from './pages/about/about.component';
import { aboutResolver, animalArticleResolver, homeResolver } from './services/resolvers';

export const routes: Routes = [
    { path: '', component: HomeComponent, resolve: {homeData: homeResolver} },
    { path: 'ueber-uns', component: AboutComponent, resolve: {aboutData: aboutResolver} },
    { path: 'tierartikel/:name', component: AnimalArticleComponent, resolve: {animalArticle: animalArticleResolver} },
    { path: 'tiere/hunde', component: DogsComponent }
];
