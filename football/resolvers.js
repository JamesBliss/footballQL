const fetch = require('node-fetch');

//
module.exports = {
  team: async (args) => {
    const id = args.id || 64;
    const url = `https://api.football-data.org/v2/teams/${id}`

    const team = await fetch(url, { headers: { "X-Auth-Token": process.env.FOOTBALL_KEY } })
      .then(res => res.json());

    return team;
  }
}