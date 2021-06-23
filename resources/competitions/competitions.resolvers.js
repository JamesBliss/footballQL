const _ = require('lodash');
const moment = require('moment');

const redisApi = require('../../redis/api');

//
const queries = {
  competitionStandings: async (parent, args) => {
    // default to Premier League
    const id = args.id || args.code || 'PL';
    const url = `https://api.football-data.org/v2/competitions/${id}/standings`;

    const {data, error} = await redisApi.get(url, 'hour');

    return {
      data,
      errors: error ? [error] : []
    }
  },
  competitionCurrentMatchday: async (parent, args) => {
    // default to Premier League
    const id = args.id || args.code || 'PL';

    // get teams
    const teamsUrl = `https://api.football-data.org/v2/competitions/${id}/teams`;
    const { data: teams, error: teamsError } = await redisApi.get(teamsUrl, 'year');

    // run pre url to access the matchday
    const competitionsUrl = `https://api.football-data.org/v2/competitions/${id}`
    const { data: competition, error: competitionError }= await redisApi.get(competitionsUrl, 'hour');
    const matchday = _.get(competition, 'currentSeason.currentMatchday', 1) || 1;

    // call normal query
    const url = `https://api.football-data.org/v2/competitions/${id}/matches?matchday=${matchday}`
    const { data: matches, error: matchesError }= await redisApi.get(url, 'hour');

    const matchlist = matches ? {
      ...matches,
      days: []
    } : null;

    if (matchlist) {
      // adding more team information into each match
      matchlist.matches = matchlist.matches.map((item) => {
        const homeTeamId = item.homeTeam.id;
        const awayTeamId = item.awayTeam.id;

        const homeTeam = _.find(teams.teams, { id: homeTeamId });
        const awayTeam = _.find(teams.teams, { id: awayTeamId });

        const merged = { ...item, homeTeam: { ...homeTeam }, awayTeam: { ...awayTeam } }

        return merged
      });

      // grouping matches into day format
      matchlist.matches.forEach((item) => {
        const day = moment(item.utcDate).startOf('day').format();
        const indexDay = _.findIndex(matchlist.days, { utcDate: day });

        if (indexDay === -1) {
          matchlist.days.push({
            utcDate: day,
            displayDate: moment(day).format('Do MMM'),
            displayDateFull: moment(day).format('Do MMM'),
            until: moment(day).toNow(),
            matches: [{ item }],
            groupedMatches: [
              {
                utcDate: item.utcDate,
                displayDate: moment(item.utcDate).format('h:mma'),
                displayDateFull: moment(item.utcDate).format('dddd Do MMMM - h:mma'),
                until: moment(item.utcDate).toNow(),
                matches: [item]
              }
            ]
          });
        } else {
          matchlist.days[indexDay].matches.push(item);

          const index = _.findIndex(matchlist.days[indexDay].groupedMatches, { utcDate: item.utcDate });
          if (index === -1) {
            matchlist.days[indexDay].groupedMatches.push({
              utcDate: item.utcDate,
              displayDate: moment(item.utcDate).format('h:mma'),
              displayDateFull: moment(item.utcDate).format('dddd Do MMMM - h:mma'),
              until: moment(item.utcDate).toNow(),
              matches: [item]
            });
          } else {
            matchlist.days[indexDay].groupedMatches[index].matches.push(item);
          }
        }
      });
    }

    // handling erros
    const errors = [
      teamsError,
      competitionError,
      matchesError,
    ].filter((er) => {
      return er != null;
    });

    // return values
    return {
      data: {
        ...matchlist
      },
      errors
    };
  }
}

module.exports = {
  queries
}