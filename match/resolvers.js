const fetch = require('node-fetch').default
const Moment = require('moment');

//
module.exports = {
  nextMatch: async (data) => {
    const id = 64;
    const date = Moment(new Date());
    const today = date.format('YYYY-MM-DD');
    const week = date.add(1, 'M').format('YYYY-MM-DD');

    const url = `https://api.football-data.org/v2/teams/${id}/matches?dateFrom=${today}&dateTo=${week}`

    const match = await fetch(url, { headers: { "X-Auth-Token": process.env.FOOTBALL_KEY } })
      .then(res => res.json());

    return match.matches[0];
  }
}