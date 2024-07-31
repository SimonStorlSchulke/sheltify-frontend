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
import { MentoringComponent } from './pages/forms/mentoring/mentoring.component';
import { ImprintComponent } from './pages/imprint/imprint.component';
import { blogArticleResolver, BlogComponent } from './blog/blog.component';

export const routes: Routes = [
    { path: '', component: HomeComponent, resolve: {homeData: homeResolver} },
    { path: 'ueber-uns', component: AboutComponent, resolve: {aboutData: aboutResolver} },
    { path: 'vermittlung', component: ConveyComponent, resolve: {conveyData: conveyResolver} },
    { path: 'helfen', component: HelpComponent, resolve: {helpData: helpResolver} },
    { path: 'tiere/hunde', component: DogsComponent },
    { path: 'news', component: NewsComponent, resolve: {newsData: newsResolver} },
    { path: 'news/:id', component: BlogComponent, resolve: {articleData: blogArticleResolver} },
    { path: 'kontakt', component: ContactComponent, resolve: {contactData: contactResolver} },
    { path: 'impressum', component: ImprintComponent},
    { path: 'tierartikel/:name', component: AnimalArticleComponent, resolve: {animalArticle: animalArticleResolver} },
    { path: 'formulare/bewerbung', component: ApplyComponent },
    { path: 'formulare/patenschaftsantrag', component: MentoringComponent },
];
