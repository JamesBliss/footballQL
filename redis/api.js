const fetch = require('node-fetch').default
const { GraphQLError } = require('graphql/error');

// cache
const redis = require('./index');

// helpers
const timeInSeconds = {
  year: 31536000,
  month: 2592000,
  week: 604800,
  day: 86400,
  hour: 3600,
  minute: 60,
  second: 1
}

//
const KEY = process.env.FOOTBALL_KEY;

//
module.exports = {
  get: async (url, expire = 'day') => {
    // check to see if url is already in cache
    const exists = await redis?.get(url);

    if (exists) {
      // returns exisiting cacheData
      return {
        data: JSON.parse(exists),
        error: null
      }
    }

    try {
      const res = await fetch(url, { headers: { "X-Auth-Token": KEY } });

      const data = await res.json();

      // handle general error
      if (data.errorCode) {
        return {
          data: null,
          error: {
            call: url,
            message: data.message || 'Something went wrong',
            errorCode: data.errorCode || 500,
          }
        }
      }

      // Cache default 1 day.
      const expireTime = timeInSeconds?.[expire] || timeInSeconds.day;

      // calculating expired dates
      const cached = new Date();
      const cachedUntil = new Date();
      cachedUntil.setSeconds(cachedUntil.getSeconds() + expireTime);

      // setup cached data load
      const cacheData = { ...data, ...{ cached, cachedUntil } };

      // Push to redis
      redis?.set(url, JSON.stringify(cacheData), 'EX', expireTime);

      // return cacheData.
      return {
        data: cacheData,
        errors: null
      };
    } catch (error) {
      throw new GraphQLError(
        url, null, null, null, null, null, error
      );
    }

  }
}