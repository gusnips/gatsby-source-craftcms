# gatsby-source-craftcms

## deprecated
Use https://www.gatsbyjs.org/packages/gatsby-source-graphql/ instead
  
  
  
  
### About
Source plugin for pulling data into [Gatsby](https://github.com/gatsbyjs) from a [CraftCMS](https://craftcms.com) endpoint  
Based on [gatsby-source-graphcms](https://github.com/GraphCMS/gatsby-source-graphcms)  
Tested in Gatsby v1 and v2

### Install

1. `yarn add gatsby-source-craftcms` or `npm i gatsby-source-craftcms`
1. Make sure plugin is referenced in your Gatsby config, as in the
   [example&nbsp;below](#usage)
1. `gatsby develop`

### Usage

_In your gatsby config..._

```javascript
plugins: [
  {
    resolve: `gatsby-source-craftcms`,
    options: {
      endpoint: `craftcms.mydomain.com/api`,
      token: `graphql_token`,
      query: `{
          categories(site:"default",groupId:12) {
              id
              title
              slug
              uri
          },
          entries(section:[news],site:"premium") {
            id
            uri
            title
            slug
          },
          home: entries(section:[home],site:"premium") {
            id
            uri
            title
            slug
          }
      }`,
    },
  }
],
```

Gatsby’s data processing layer begins with “source” plugins, configured in `gatsby-config.js`. Here the site sources its data from the CraftCMS endpoint. Use an `.env` file or set environment variables directly to access the CraftCMS  
endpoint and token. This avoids committing potentially sensitive data.  

_In your gatsby-node.js ..._  

```javascript
const path = require("path");

exports.createPages = ({ graphql, boundActionCreators }) => {
  const { createPage } = boundActionCreators;

  return new Promise((resolve, reject) => {
    const postPage = path.resolve("src/templates/post.js");
    resolve(
      graphql(`{
        allEntry(sort: { fields: [postDate], order: DESC}){
          edges {
            news: node{
              id
              title
              slug
              postDate
            }
          }
        }
      }`).then(result => {
        if (result.errors) {
          reject(result.errors);
        }
        result.data.allEntry.edges.forEach(edge => {
          createPage({
            path: edge.news.slug,
            component: postPage,
            context: {
              slug: edge.news.slug
            }
          });
        });
      })
    );
  });
};

```

### Plugin options

|              |                                                          |
| -----------: | :------------------------------------------------------- |
| **endpoint** | indicates the endpoint to use for the graphql connection |
|    **token** | The API access token. Optional if the endpoint is public |
|    **query** | The GraphQL query to execute against the endpoint        |

### How to query : GraphQL

Let’s say you have a GraphQL type called `Categories`. You would query all artists
like so:

```graphql
{
  allCategory {
    id
    title
}
```

entries example, to use in your template:  

```javascript
export const pageQuery = graphql`
query GetPost($slug: String!) {
  entry(slug: { eq: $slug }) {
    id
    slug
    title
    summary
    uri
    enableComments
    contentPost {
      block{
        content
        totalPages
      }
      quoteText
      imagem{
        url
      }
      titleH1
      subtitleH2
    }
    category {
      title
      slug
    }
    tags{
      title
      slug
    }
  }
}
`;

```

### Testing plugin contributions

1. `cd` to the Gatsby install you want to test your changes to the plugin code
   with, or clone [@CraftCMS/gatsby-craftcms-example](https://github.com/gusnips/gatsby-craftcms-example)
1. If you cloned the example or previously installed the plugin through `yarn`
   or `npm`, `yarn remove gatsby-source-craftcms` or `npm r
   gatsby-source-craftcms`
1. `mkdir plugins` if it does not exist yet and `cd` into it
1. Your path should now be something like
   `~/code/gusnips/myKillerGatsbySite/plugins/`
1. `git clone https://github.com/gusnips/gatsby-source-craftcms.git`
1. `cd gatsby-source-craftcms`
1. `yarn` or `yarn && yarn watch` in plugin’s directory for auto-rebuilding the
   plugin after you make changes to it—only during development
1. Make sure plugin is referenced in your Gatsby config, as in the
   [example&nbsp;below](#usage)
1. From there you can `cd ../.. && yarn && yarn develop` to test

#### Every time you rebuild the plugin, you must restart Gatsby’s development server to reflect the changes in your test environment.
