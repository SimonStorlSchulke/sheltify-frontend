import { RichTextNode } from "../../services/blockRenderer";
import { StrapiImage } from "../../shared/shared-types";

export type SectionComponentType = "article-section.text" | "article-section.text-with-image-section" | "article-section.hero" | "article-section.image"

export type ArticleSection = ArticleTextSection | ArticleTextWithImageSection | ArticleHeroSection;

export type ArticleTextSection = {
    __component: SectionComponentType,
    title: string,
    text: RichTextNode[],
}


export type ArticleImageSection = {
    __component: SectionComponentType,
    title: string,
    images: StrapiImage[],
}

export type ArticleTextWithImageSection = {
    __component: SectionComponentType,
    title: string,
    text: RichTextNode[],
    images?: StrapiImage[],
    imagePosition: "oben"
    | "rechts"
    | "links"
    | "unten";
}

export type ArticleHeroSection = {
    __component: SectionComponentType,
    title: string,
    hero: StrapiImage,
}