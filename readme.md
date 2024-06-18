# router prepass

see full project at https://github.com/stephan-dum/micro-frame

## sales pitch

### advantages
- both in and out of order server streaming
- in order client rendering
- supports early hints
- side effect free css
- deep lazy loaded routes
- server only components
- client only components
- above the fold optimization
- cache for render leafs
- ssr middleware for setting up services
- possibility to inject functionality into render context (ie services) 
- lazy hydrate / rendering components based on viewport
- reduce hydration need (because anchor and form are handle with a global event listener)
- extensible for other frameworks
- combine multiple packages / repositories with ease

### implications
- multi-tenant through webpack plugin
- multi-language through subdomain / path prefix
- clear separation of data layer and render layer
- progressive enhancement
- full freedom and flexibility to extend further

### disadvantages
- little documentation
- not part of core business
- currently no SSG

### evaluation for next gen
- support optional out of order streaming / client side only components
- in oder client side rendering optional
- use vite or turbo-pack or rs pack
- service worker
- prefetch routes on hover

## Docs

### Philosophy


### Configuration

Some parts can be configured through a config file named `micro-config.ts`.



