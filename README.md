# SSR - Router with SSR for Node & Meteor

Server side rendering with Express, react-router-4 & redux for Meteor.

## Usage
### Installation in your own project

You can replace yarn by your favorite way of installing NPM packages.  
To install yarn : https://yarnpkg.com/en/docs/install  
To install "meteor yarn" : ```meteor npm i -g yarn```  

```
meteor yarn add react react-dom react-router@next express helmet react-helmet \
  winston logatim receptacle useragent es6-enum redux react-redux moment
meteor add ssrwpo:ssr
```

### To run the demo based on this repository

```
git clone https://github.com/ssr-server/ssr.git && cd ssr
meteor yarn install
cd demo
meteor yarn install
yarn meteor
```

### Client side call
```js
import { createRouter, logger } from 'meteor/ssrwpo:ssr';
import { BrowserRouter } from 'react-router';
...
createRouter({
  // Your MainApp as the top component that will get rendered in <div id='react' />
  MainApp,
  // Optional: Store subscription (equivalent to `store.subscribe(store => storeSubscription(store))`)
  storeSubscription,
  // Optional: An object containing your application reducers
  appReducers,
  // Optional: An array of your redux middleware of choice
  appMiddlewares,
  // Optional: An array of your collection names
  appCursorNames,
  // The router used in your client
  BrowserRouter,
})
.then(() => logger.info('Router started'));
```

### Server side call
```js
import { createRouter, logger } from 'meteor/ssrwpo:ssr';
import { ServerRouter, createServerRenderContext } from 'react-router';
...
createRouter({
  // Your MainApp as the top component rendered and injected in the HTML payload
  MainApp,
  // Optional: Store subscription (equivalent to `store.subscribe(store => storeSubscription(store))`)
  storeSubscription,
  // Optional: An object containing your application reducers
  appReducers,
  // Optional: An object containing the cursors required as data context
  appCursors,
  // Optional: A function returning a string with the content of your robots.txt
  robotsTxt,
  // Optional: A function returning a string with the content of your sitemap.xml
  sitemapXml,
  // Optional: An object with keys on URL with query parameters
  urlQueryParameters,
  // Optional: An object with keys on route solver
  webhooks,
  // The server side router from react-router-4
  ServerRouter,
  createServerRenderContext,
});
logger.info('Router started');
```

### Robots.txt and Sitemap.xml

To set up your robots.txt, you need to have a key "robotsTxt" inside the object that you pass to the server-side createRouter function.  
This key should contain a function that returns a string with the desired content of your robots.txt.  
The same principle applies to sitemap.xml, with the key "sitemapXml".  
The function that you pass will receive store as it's first parameter.  
This allows you to programmatically build your sitemap.xml or robots.txt based on the store contents.  
For example, you can populate your sitemap.xml of dynamic routes generated based on the store data.  
You can see examples of building these functions here:  
* [Robots.txt](https://github.com/ssr-server/ssr/blob/master/demo/server/robotsTxt.js "Robots.txt builder")  
* [Sitemap.xml](https://github.com/ssr-server/ssr/blob/master/demo/server/sitemapXml.js "Sitemap.xml builder")

For easing the sitemap creation, a convenient tool `sitemapFromArray` accepts an array of object with the following keys:

* `slug`: A mandatory relative URL to a page
* `lastmod`: An optional `Date`
* `changefreq`: An optional frequency of robot's revisiting with the following allowed values: `always`, `hourly`, `daily`, `weekly`, `monthly`, `yearly`, `never`.
* `priority`: An optional priority when search engine are displaying your map. When none provided, robots are using 0.5. This value range from 0 to 1.

For using it:
```js
// Server side only
import { sitemapFromArray } from 'meteor/ssrwpo:ssr';
...
const sitemapContent = sitemapFromArray([
  // The home
  { slug: '', lastmod: new Date(), priority: 1 },
  // A frequently changed news page
  { slug: 'news', changefreq: 'hourly' },
  // ...
]);
```

### Platform detection
For the initial render, your app may require some defaults to ensure that
it will server retina images or specific layout for a platform.

The `platform` detection reducer provides the following platforms:

* `android`: Any tablet or phone with Android using Chrome or the built-in browser.
* `ipad`:  Any Apple iPad.
* `iphone`: Any Apple iPhone.
* `safari`: Any MacOS Safari (not iPhone or iPad).
* `ie`: Any Internet Explorer before Edge.
* `default`: All the other browsers and devices.

### Build date
Each produced HTML payload is tagged with a build date allowing capabilities
to check if a reload is required. The reducer is named `buildDate` and it
contains a UNIX date.

### Performance helpers
#### pure
Asymetric HOC for transforming a functional component into a `React.PureComponent` on the client and leaving it unmodified on the server.

``` js
import React from 'react';
import { pure } from 'meteor/ssrwpo:ssr';

const MyComponent = (props) => ( ... );
export default pure(MyComponent);
```

Example: [Performance](https://github.com/ssr-server/ssr/blob/master/demo/imports/routes/Performance.jsx "Performance")


## Configuration
### Universal logger
#### Loglevel
In your Meteor's settings under the `ssr` object, use the `loglevel` key for
settings the expected log level. Available values:

* **`debug`** Debugging and performance.
* **`info`** (default) Informations.
* **`warning`** Warnings and deprecation messages.
* **`error`** Errors.

### Recommended Babel configuration
For optimal results, set your `.babelrc` with the following content:
```json
{
  "presets": ["meteor"],
  "plugins": [
    "transform-class-properties",
    "transform-react-remove-prop-types",
    "transform-react-constant-elements",
    "transform-react-inline-elements",
    "transform-dead-code-elimination"
  ]
}
```

## Package development
### Benchmarks
For profiling the most appropriate libraries or function call a benchmark suite
is setup in `benchmarks`. Launch a test using [`babel-node`](https://babeljs.io/docs/usage/cli/#babel-node).

Ex. `babel-node benchmarks/getFromObject.js`

### Debug helpers
The last request and last response received in Express are exposes by this
package as `debugLastRequest` and `debugLastResponse`, respectively. In Meteor's
shell, you can access them via:

```js
import { debugLastRequest, debugLastResponse } from 'meteor/ssrwpo:ssr';
```

### Launching tests
This project uses [Jest](https://facebook.github.io/jest/) and [chai](http://chaijs.com/).

```
# In one-shot mode:
yarn test
# In watch mode:
yarn test -- --watchAll --notify
```

### Linting
The linter is based on [ESlint](http://eslint.org/) configured with [Airbnb styles](https://github.com/airbnb/javascript).

```
yarn lint
```

:warning: All code must be linted before sending any PR. See the [Contributing guide](./CONTRIBUTING.md).

## Roadmap
### v1
* [X] Universal logger
* [X] Client side routing
* [X] Server side routing
  * [X] Main routing
  * [X] Missed route (404)
  * [X] Redirect route
  * [X] URL query parameters
* [X] Sitemaps
* [X] Robots.txt
* [X] Cache control (etag, max-age, if-none-match)
* [X] User agent sniffing as data context
* [X] Reactive collections as data context
* [X] Server side only routes and REST API for webhooks
* [X] Server side LRU cache with TTL for
  * [X] Routes
  * [X] User agent
  * [X] Data context
* [X] Counter measure when Meteor.Reload starts requesting the same URL over & over again

### v2
* [ ] Configurable browser policy
* [ ] Application cache API
* [ ] Service workers
* [ ] i18n support
* [ ] Cache prefilling
* [ ] API for cache limit control
* [ ] Server side routing
  * [ ] No SSR routes
* [ ] Component caching with Electrode
* [ ] Server stats
  * [ ] From cache vs rendered
  * [ ] System usage: CPU, RAM
  * [ ] Most rendered page
  * [ ] Longest rendered page

### v3
* [ ] Styled components
* [ ] Above the fold
* [ ] Code splitting

## 3rd party documentation
- [Application router: react-router-4](https://react-router.now.sh)
- [Client side logging: logatim](https://github.com/sospedra/logatim)
- [Server side logging: winston](https://github.com/winstonjs/winston)
- [Protocol: Robots.txt](http://www.robotstxt.org/)
- [Protocol: Sitemaps](https://www.sitemaps.org/)
- [Server side security: helmet](https://github.com/helmetjs/helmet)
- [Server side performance profiling: benchmark](https://benchmarkjs.com/)
- [In memory LRU cache: receptacle](https://github.com/DylanPiercey/receptacle)
- [Server side component caching: electrode-react-ssr-caching](https://github.com/electrode-io/electrode-react-ssr-caching)
- [User agent parser: useragent](https://github.com/3rd-Eden/useragent)
- [Meteor issue on Hot code push](https://github.com/meteor/meteor/issues/7115)
- [Discussions about Hot code push issue](https://forums.meteor.com/t/app-constantly-refreshing-after-an-update/23586/143)
- [Unit tests: Jest](https://facebook.github.io/jest/)
- [Unit tests: chai](http://chaijs.com/)

## Links
- [Reactjs - Speed up Server Side Rendering - Sasha Aickin](https://www.youtube.com/watch?v=PnpfGy7q96U)
- [Hastening React SSR with Component Memoization and Templatization](https://www.youtube.com/watch?v=sn-C_DKLKPE)
- [Server-Side Rendering: Live Code Session - Supercharged (with info on cache control)](https://www.youtube.com/watch?v=8LM4p7l9YMY)
- [AppCache](https://developer.mozilla.org/en-US/docs/Web/HTML/Using_the_application_cache#Browser_compatibility)
- [Caching best practices & max-age gotchas](https://jakearchibald.com/2016/caching-best-practices/)
- [Increasing Application Performance with HTTP Cache Headers](https://devcenter.heroku.com/articles/increasing-application-performance-with-http-cache-headers)
- [Progressive Web Apps With React](https://addyosmani.com/blog/progressive-web-apps-with-react/)
- [Discussion on main thread at client side initial rendering](https://github.com/developit/preact/issues/407)
