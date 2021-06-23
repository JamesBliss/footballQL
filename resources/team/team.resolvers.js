const redisApi = require('../../redis/api');

//
const queries = {
  teamByID: async (parent, args) => {
    const id = args.id;
    const url = `https://api.football-data.org/v2/teams/${id}`

    const payload = await redisApi.get(url, 'year');

    return {
      errors: payload.error ? [payload.error] : [],
      data: payload.data
    }
  }
}

// resolver exportes
module.exports = {
  queries
}