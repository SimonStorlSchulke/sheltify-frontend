export type StrapiMedia = {
    id: number
    name: string
    alternativeText: string
    caption?: string
    width: number
    height: number
    formats?: {
      thumbnail: {
        url: string
      },
      small?: {
        url: string
      },
      medium?: {
        url: string
      },
      large?: {
        url: string
      },
      xlarge?: {
        url: string
      },
    }
    hash: string
    ext: string
    mime: string
    size: number
    url: string
    previewUrl: any
    provider: string
    provider_metadata: any
    createdAt: string
    updatedAt: string
  }

  export type StrapiFilter = {
    field: string,
    operator?: 
    "eq" | "eqi" | "ne" | "nei" 
    | "lt" | "lte" | "gt" | "gte" | "in"
    | "notIn" | "contains" | "notContains" | "containsi"
    | "notIn" | "contains" | "notContains" | "containsi"
    | "notContainsi" | "null" | "notNull" | "between"
    | "startsWith" | "startsWithi" | "endsWith" | "endsWithi"
    | "or" | "and" | "not",
    value: string,
  }

  export type AnimalKind = {
    name: string,
    icon: StrapiMedia,
  }

export type Animal = {
    id: number,
    documentId: string,
    updatedAt: string,
    publishedAt: string,
    name: string,
    gender: "male" | "female" | "other";
    thumbnail?: StrapiMedia,
    description: string,
    emergency?: boolean,
    whereInGermany?: string,
    castrated?: boolean,
    shoulderHeightCm?: number,
    animalKind?: AnimalKind,
    birthday?: string,
    diseases?: string,
    tolerating?: string,
    suitedFor?: string,
    priority: number,
    animal_article?: {
    updatedAt: string,  // for sorting
    }
  }
  