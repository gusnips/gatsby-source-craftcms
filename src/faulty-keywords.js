import {filter} from 'ramda';

const keywords = [
  `length`
];

const getAllObjKeys = obj => {
  const all = [];
  const getObjKeys = obj2 =>
    Object.keys(obj).forEach(key => {
      if (obj2[key] instanceof Object) {
        getObjKeys(obj2[key]);
      }
      all.push(key);
    });
  getObjKeys(obj);

  return all;
};

const checkForKeyword = key =>
  keywords.includes(key);

// Checking if the query we pass in config has any of the faulty fields
export const checkForFaultyFields = userQueryResult => {
  const allKeys = getAllObjKeys(userQueryResult);
  const faultyFields = filter(checkForKeyword, allKeys);

  return faultyFields.length;
};

export const keywordsError = `Found unaliased reserved field with a name matching one of [ ${keywords} ]. Build failed! Please refer to the caveats in the gatsby-source-craftcms README for a solution: https://github.com/CraftCMS/gatsby-source-craftcms#length-must-be-aliased`;
