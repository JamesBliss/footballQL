const fetch = require('node-fetch').default
const Moment = require('moment');

//
module.exports = {
  nextMatch: async (data) => {
    console.log('hello', data);

    const id = 64;
    const date = Moment(new Date());
    console.log(data)
    const today = date.format('YYYY-MM-DD');
    console.log(today)
    const week = date.add(1, 'M').format('YYYY-MM-DD');
    console.log(week)

    const url = `https://api.football-data.org/v2/teams/${id}/matches?dateFrom=${today}&dateTo=${week}`

    const match = await fetch(url, { headers: { "X-Auth-Token": process.env.FOOTBALL_KEY } })
      .then(res => res.json());

    console.log({match})
    console.log({...match.matches})

    return match.matches[0];
  }
}