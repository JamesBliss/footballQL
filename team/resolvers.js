const cache = require('../cache');
const api = require('../api');

//
module.exports = {
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