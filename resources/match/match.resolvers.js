const Moment = require('moment');
const _ = require('lodash');

//
const redisApi = require('../../redis/api');

// match.resolvers.queries
const queries = {
  nextMatchByID: async (parent, args, ctx) => {
    const id = args.id || 64;
    const date = Moment(new Date());
    const today = date.format('YYYY-MM-DD');
    const week = date.add(10, 'M').format('YYYY-MM-DD');

    // get matches for the team
    const url = `https://api.football-data.org/v2/teams/${id}/matches?dateFrom=${today}&dateTo=${week}`;
    const { data, error } = await redisApi.get(url, 'hour');

    // get the next match
    const match = data?.matches?.[0] || null;

    if (match) {
      // get teams for the competition
      const teamsUrl = `https://api.football-data.org/v2/competitions/${match.competition.id}/teams`;
      const { data: teams, error: teamsError } = await redisApi.get(teamsUrl, 'year');

      // if the comp worked then map teams
      if (teams) {
        const homeTeam = _.find(teams.teams, { id: match.homeTeam.id });
        const awayTeam = _.find(teams.teams, { id: match.awayTeam.id });

        match.homeTeam = { ...match.homeTeam, ...homeTeam };
        match.awayTeam = { ...match.awayTeam, ...awayTeam };
      }

      const duration = Moment.duration(Moment.utc(match.utcDate).diff(Moment()));

      console.log({ teamsError})

      return {
        data: {
          ...match,
          cached: data.cached,
          cachedUntil: data.cachedUntil,
          time: {
            hours: duration.get('hours'),
            minutes: duration.get('minutes'),
            days: duration.get('days')
          }
        },
        errors: teamsError ? [teamsError] : []
      }
    }
    return {
      data: null,
      errors: error ? [error] : []
    }
  },
  nextMatchesByCompetition: async (parent, args, ctx) => {
    // `2021` || 'PL' = Premier League
    const id = args.id || args.code || 2021;

    const url = `https://api.football-data.org/v2/matches?competitions=${id}`;

    const {data, error} = await redisApi.get(url, 'hour');

    return {
      data,
      errors: error ? [error] : []
    };
  }
}

// resolver exportes
module.exports = {
  queries
}