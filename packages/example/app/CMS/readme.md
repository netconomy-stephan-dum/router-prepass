## database

### tables

components
id


```ts
interface Component {
  type: string,
  props: Record<string, unknown>
}

type Components = Component[];
``` 

possible return value

```json5
[
  {
    "type": "hero",
    "props": {
      "img": "/some/image",
      "href": "/c/aktionen",
      "button": true,
      "text": ""
    }
  },
  {
    "type": "any",
    props: {
      "tagName": "article", 
      "grid": {
        // also thing about different resolutions
      },
      "flex": {
        // also thing about different resolutions
      },
    }
    "children": [
      {
        "type": "any",
        props: {
          tagName: 'h2',
        }
      },
      {
        type: 'any',
        props: {
          "tagName": "p",
          "text": "Some paragraph text",
        }
      },
      {
        type: "any",
        props: {
          tagName: "section",
          "grid" : {
            // also thing about different resolutions
          },
          "flex": {
            // also thing about different resolutions
          },
        },
        children: [
          {
            type: "imageLink",
            props: {
              img: '/some/img',
              href: '/to-some-page',
              label: 'href-label'
            }
          }
        ]
      }
    ]
    
  }
]
```
## react components
imagelink
categoryTile
tabs / router
hero
lazy slider
slider
product thumb component

any
    list ol / ul
    heading
    layout = grid / flex
    section inherits layout?
    article inherits layout?
    image
    paragraph (Rich Text sanitized on SSR fetch)
    video
