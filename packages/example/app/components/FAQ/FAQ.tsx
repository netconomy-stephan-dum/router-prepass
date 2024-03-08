import { MicroNode } from '@micro-frame/utils/types';

const FAQSearchResults = () => {
  return <a href="/faq/category/some-cat">Search Results</a>
}
const FAQOverview = () => {
  return <div>FAQOverview</div>;
}
const FAQAnswer = () => {
  return <div>FAQAnswer</div>;
}
const FAQHeader = () => {
  return <div>FAQ Header</div>;
}
const FAQNavigation = () => {
  return <ul><li><a href="/faq/category/some-cat/my-code">my code cat</a></li></ul>;
}
const FAQSearch = () => {
  return (
    <form action="/faq/search" method="GET">
      <input type="text" name="query"/>
      <input type="submit" />
    </form>
  )
}

const FAQ: MicroNode = {
  type: 'fragment',
  meta: [{ tagName: 'title', children: ['hello faq'] }],
  statusCode: 200,
  children: [
    {
      type: 'react',
      component: FAQSearch,
      aboveFold: true,
    },
    {
      type: 'router',
      routes: [
        {
          path: /\/search/,
          node: {
            type: 'react',
            component: FAQSearchResults,
          },
        },
        {
          path: /\/category\/([^/]+)/,
          node: [
            {
              type: 'react',
              component: FAQHeader,
            },
            {
              type: 'fragment',
              wrapper: { tagName: 'section', children: [{ tagName: 'div', data: {root: 'true'}}] },
              children: [
                {
                  type: 'react',
                  component: FAQNavigation,
                },
                {
                  type: 'router',
                  routes: [
                    {
                      path: /\/(?<code>[^/]+)/,
                      node: {
                        type: 'react',
                        component: FAQAnswer,
                      },
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          node: {
            type: 'react',
            component: FAQOverview,
          },
        },
      ],
    },
  ],
};

/* alternative syntax
[
  <React component={FAQSearch} aboveFold={true} />
  <Router>
    <Route path={/\/search/}>
      <React component={FAQSearch} />
    </Route>
    <Route path={/\/category\/([^/]+)/}>
      <Fragment>
        <React component={FAQHeader} />
        <Fragment wrapper={<section><div data-root={true}></div></section>}>
          <React component={FAQNavigation} />
          <Router>
            <Route path={}>
              <React component={FAQAnswer} />
            </Route>
          </Router>
        </Fragment>
      </Fragment>
    </Route>
    <Route>
      <React component={FAQOverview} />
    </Route>
  </Router>
]
*/

export default FAQ;
