export function renderStrapiRichText(json: RichTextNode[]): string {
    return json.map(renderRichTextNode).join('');
}

function renderRichTextNode(node: RichTextNode): string {
    switch (node.type) {
        case 'heading':
            const headingLevel = node.level ?? 1;
            return `<h${headingLevel}>${renderChildren(node.children)}</h${headingLevel}>`;
        case 'paragraph':
            return `<p>${renderChildren(node.children)}</p>`;
        case 'text':
            let text = node.text ?? '';
            if (node.bold) {
                text = `<strong>${text}</strong>`;
            }
            if (node.italic) {
                text = `<em>${text}</em>`;
            }
            return text;
        case 'link':
            return `<a  ${convertButtonLinks(`href="${node.url}"`)}>${renderChildren(node.children)}</a>`;
        case 'image':
            return `<img src="${node.image?.url}" alt="${node.image?.alternativeText}" width="${node.image?.width}" height="${node.image?.height}" />`;
        case 'list':
            const listTag = node.format === 'ordered' ? 'ol' : 'ul';
            return `<${listTag}>${renderChildren(node.children)}</${listTag}>`;
        case 'list-item':
            return `<li>${renderChildren(node.children)}</li>`;
        case 'quote':
            return `<blockquote>${renderChildren(node.children)}</blockquote>`;
        default:
            return '';
    }
}

/** converts `href="https://google.de BUTTON" into href="https://google.de" class="button" */
function convertButtonLinks(linkUrl: string) {
  if(linkUrl.includes("-BUTTON-SECONDARY")) {
    return linkUrl.replace("-BUTTON-SECONDARY", "").replace('href=', 'class="button secondary inline-block" href=');
  }
  if(linkUrl.includes("-BUTTON")) {
    return linkUrl.replace("-BUTTON", "").replace('href=', 'class="button primary inline-block" href=');
  }
  return linkUrl;
}

function renderChildren(children?: RichTextNode[]): string {
    return (children ?? []).map(renderRichTextNode).join('');
}

export type RichTextNode = {
    type: string;
    children?: RichTextNode[];
    text?: string;
    bold?: boolean;
    italic?: boolean;
    url?: string;
    level?: number;
    format?: string;
    image?: {
        name: string;
        alternativeText: string;
        url: string;
        caption: string | null;
        width: number;
        height: number;
        formats: {
            thumbnail: {
                name: string;
                url: string;
            }
        };
    };
};


// Example usage with provided JSON
export const richTextJson: RichTextNode[] = [
  {
    "type": "heading",
    "children": [
      {
        "type": "text",
        "text": "Dies ist ein "
      },
      {
        "type": "text",
        "text": "test",
        "bold": true
      },
      {
        "type": "text",
        "text": " text-block"
      }
    ],
    "level": 2
  },
  {
    "type": "paragraph",
    "children": [
      {
        "type": "text",
        "text": "Zuerst etwas Fließtext bitte."
      }
    ]
  },
  {
    "type": "paragraph",
    "children": [
      {
        "type": "text",
        "text": "Dann etwas mehr fließtext - diesesmal mit "
      },
      {
        "type": "text",
        "text": "italics und einem ",
        "italic": true
      },
      {
        "type": "link",
        "url": "https://google.com",
        "children": [
          {
            "type": "text",
            "italic": true,
            "text": "Link"
          }
        ]
      },
      {
        "type": "text",
        "text": "."
      }
    ]
  },
  {
    "type": "paragraph",
    "children": [
      {
        "type": "text",
        "text": "Dann hier mal ein Bild:"
      }
    ]
  },
  {
    "type": "image",
    "image": {
      "name": "kylo.png",
      "alternativeText": "kylo.png",
      "url": "http://localhost:1337/uploads/kylo_53a704af43.png",
      "caption": null,
      "width": 351,
      "height": 353,
      "formats": {
        "thumbnail": {
          "name": "thumbnail_kylo.png",
          "url": "/uploads/thumbnail_kylo_53a704af43.png"
        }
      },
    },
    "children": [
      {
        "type": "text",
        "text": ""
      }
    ]
  },
  {
    "type": "list",
    "format": "unordered",
    "children": [
      {
        "type": "list-item",
        "children": [
          {
            "type": "text",
            "text": "und"
          }
        ]
      },
      {
        "type": "list-item",
        "children": [
          {
            "type": "text",
            "text": "bullet"
          }
        ]
      },
      {
        "type": "list-item",
        "children": [
          {
            "type": "text",
            "text": "points"
          }
        ]
      }
    ]
  },
  {
    "type": "list",
    "format": "ordered",
    "children": [
      {
        "type": "list-item",
        "children": [
          {
            "type": "text",
            "text": "bzw"
          }
        ]
      },
      {
        "type": "list-item",
        "children": [
          {
            "type": "text",
            "text": "nummeriert"
          }
        ]
      }
    ]
  },
  {
    "type": "quote",
    "children": [
      {
        "type": "text",
        "text": "Dies ist ein Zitat"
      }
    ]
  },
  {
    "type": "heading",
    "children": [
      {
        "type": "text",
        "text": "Und noch eine Überschrift"
      }
    ],
    "level": 3
  }
];

const htmlOutput = renderStrapiRichText(richTextJson);
console.log(htmlOutput);