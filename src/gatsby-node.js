import {GraphQLClient} from 'graphql-request';
import {forEachObjIndexed} from 'ramda';
import {createNodes} from './util';
import {DEBUG_MODE} from './constants';
import {keywordsError, checkForFaultyFields} from './faulty-keywords';

exports.sourceNodes = async (
  {boundActionCreators, reporter},
  {endpoint, token, query}
) => {
  if (query) {
    const {createNode} = boundActionCreators;

    const clientOptions = {
      headers: {
        Authorization: token ? `Bearer ${token}` : undefined
      }
    };

    const client = new GraphQLClient(endpoint, clientOptions);
    const userQueryResult = await client.request(query).then(data => {
      // Console.log('data', data)
      Object.keys(data).map(k => {
        if (data[k].map) {
          data[k] = data[k].map(d => {
            if (typeof d.id !== 'undefined') {
              d.id = d.id.toString();
            }
            return d;
          });
        }
        if (data[k].hasOwnProperty("edges")) {
          data[k] = data[k].edges.map(function (d) {
            if (typeof d.node.id !== 'undefined') {
              d.node.id = d.node.id.toString();
            }
            const node = { ...d.node };
            if (typeof d.relatedEntries !== 'undefined') {
              node.relatedEntries = d.relatedEntries
            }
            return node;
          });
        }
        return data[k];
      });
      return data;
    });

    // Keywords workaround
    if (checkForFaultyFields(userQueryResult)) {
      reporter.panic(`gatsby-source-craftcms: ${keywordsError}`);
    }

    if (DEBUG_MODE) {
      const jsonUserQueryResult = JSON.stringify(userQueryResult, undefined, 2);
      // eslint-disable-next-line no-console
      console.log(
        `\ngatsby-source-craftcms: GraphQL query results: ${jsonUserQueryResult}`
      );
    }
    forEachObjIndexed(createNodes(createNode, reporter), userQueryResult);
  } else {
    reporter.panic(
      `gatsby-source-craftcms: you need to provide a GraphQL query in the plugin 'query' parameter`
    );
  }
};
