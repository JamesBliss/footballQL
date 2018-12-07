const fetch = require('node-fetch').default
const Moment = require('moment');
const { GraphQLError } = require('graphql/error');
const cache = require('../cache');

//
const KEY = process.env.FOOTBALL_KEY;

// 1. set resolver cacheControl
// 2. default to liverpool id but override by custom id
// 3. get matches from today until end of month
// 4. build url
// 5. check if fetch is in cache
// 6. return the first match in the matches
module.exports = {
  nextMatch: async (parent, args, ctx, { cacheControl }) => {
    cacheControl.setCacheHint({ maxAge: 60 });

    const id = args.id || 64;
    const date = Moment(new Date());
    const today = date.format('YYYY-MM-DD');
    const week = date.add(1, 'M').format('YYYY-MM-DD');

    const url = `https://api.football-data.org/v2/teams/${id}/matches?dateFrom=${today}&dateTo=${week}`;

    let match = cache.get(url);

    if (!match) {
      const res = await fetch(url, { headers: { "X-Auth-Token": KEY } });
      const data = await res.json();

      if (data.errorCode) {
        throw new GraphQLError(
          {
            status: data.errorCode,
            text: data.message
          }
        );
      }
      match = data.matches[0];
      cache.set(url, match);
    }

    return match;
  }
}