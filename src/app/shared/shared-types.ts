export type StrapiImage = {
    id: number
    name: string
    alternativeText: any
    caption: any
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
    icon: StrapiImage,
  }

export type Animal = {
    id: number,
    documentId: string,
    name: string,
    gender: "male" | "female" | "other";
    thumbnail?: StrapiImage,
    description: string,
    emergency?: boolean,
    inGermany?: boolean,
    castrated?: boolean,
    shoulderHeightCm?: number,
    animalKind?: AnimalKind,
    birthday?: string,
    diseases?: string,
    tolerating?: string,
    suitedFor?: string,
  }
  