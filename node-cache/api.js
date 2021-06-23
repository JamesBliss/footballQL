const fetch = require('node-fetch').default
const { GraphQLError } = require('graphql/error');

// cache
const cache = require('./index');

//
const KEY = process.env.FOOTBALL_KEY;

//
module.exports = {
  get: async (url) => {

    let cachedData = cache.get(url);

    if (!cachedData) {
      return cachedData;
    }

    const res = await fetch(url, { headers: { "X-Auth-Token": KEY } });
    const data = await res.json();

    if (data.errorCode) {
      throw new GraphQLError(
        url, null, null, null, null, null,
        {
          status: data.errorCode,
          text: data.message
        }
      );
    }
    cache.set(url, { ...data, ...{ cached: new Date() } });

    return data;
  }
}