import { RichTextNode } from '../../services/blockRenderer';
import { Animal, StrapiImage } from '../../shared/shared-types';

export type ArticleSection =
  | ArticleTextSection
  | ArticleTextWithImageSection
  | ArticleHeroSection
  | ArticleAnimalCardsSection
  | ArticleRowStartSection
  | ButtonLinkSection
  | ArticleImageSection;

export type ArticleTextSection = {
  __component: 'article-section.text';
  title?: string;
  background?: boolean;
  text: RichTextNode[];
};

export type ArticleImageSection = {
  __component: 'article-section.image';
  title?: string;
  background?: boolean;
  images: StrapiImage[];
};

export type ButtonLinkSection = {
  __component: 'article-section.button-link';
  title?: string;
  background?: boolean;
  text: string;
  link: string;
  type: 'primary' | 'secondary' | 'call-to-action';
};

export type ArticleTextWithImageSection = {
  __component: 'article-section.text-with-image-section';
  title?: string;
  background?: boolean;
  text: RichTextNode[];
  images?: StrapiImage[];
  imagePosition: 'oben' | 'rechts' | 'links' | 'unten';
};

export type ArticleAnimalCardsSection = {
  __component: 'article-section.animal-cards';
  title?: string;
  text: RichTextNode[];
  background?: boolean;
  animals: Animal[];
};

export type ArticleHeroSection = {
  __component: 'article-section.hero';
  title: string;
  background?: boolean;
  hero: StrapiImage;
};

export type ArticleRowStartSection = {
  __component: 'article-section.row-start';
  title: string;
  background?: boolean;
  columns: number;
  textCentered: boolean;
};
