const cache = require('../../cache');
const api = require('../../cache/api');

//
const queries = {
  team: async (parent, args) => {
    const id = args.id || 64;
    const url = `https://api.football-data.org/v2/teams/${id}`

    let team = cache.get(url);

    if (!team) {
      team = await api.getTeam(url);
    }

    return team;
  }
}

// resolver exportes
module.exports = {
  queries
}