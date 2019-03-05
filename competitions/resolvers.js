const { getData, getTeamsData } = require('../helpers/index');
const _ = require('lodash');
const moment = require('moment');

//
module.exports = {
  competition: async (parent, args) => {
    // default to Premier League
    const id = args.id || 2021;
    const url = `https://api.football-data.org/v2/competitions/${id}`;

    return await getData({ url });
  },
  competitionMatches: async (parent, args) => {
    // default to Premier League
    const id = args.id || 2021;
    const matchday = args.matchday || '';
    const url = `https://api.football-data.org/v2/competitions/${id}/matches?matchday=${matchday}`;

    return await getData({ url });
  },
  competitionTeams: async (parent, args) => {
    // default to Premier League
    const id = args.id || 2021;
    const url = `https://api.football-data.org/v2/competitions/${id}/teams`;

    return await getData({ url });
  },
  competitionStandings: async (parent, args) => {
    // default to Premier League
    const id = args.id || 2021;
    const url = `https://api.football-data.org/v2/competitions/${id}/standings`;

    return await getData({ url });
  },
  competitionCurrentMatchday: async (parent, args) => {
    // default to Premier League
    const id = args.id || 2021;

    // get teams
    const teamsUrl = `https://api.football-data.org/v2/competitions/${id}/teams`;
    const teams = await getTeamsData({ url: teamsUrl });

    // run pre url to access the matchday
    const competitionsUrl = `https://api.football-data.org/v2/competitions/${id}`
    const competition = await getData({ url: competitionsUrl });
    const matchday = _.get(competition, 'currentSeason.currentMatchday', '');

    // call normal query
    const url = `https://api.football-data.org/v2/competitions/${id}/matches?matchday=${matchday}`
    const matches = await getData({ url });

    let baseMatches = matches;

    baseMatches.matches = matches.matches.map((item) => {
      const homeTeamId = item.homeTeam.id;
      const awayTeamId = item.awayTeam.id;

      const homeTeam = _.find(teams.teams, { id: homeTeamId });
      const awayTeam = _.find(teams.teams, { id: awayTeamId });

      const merged = { ...item, homeTeam: { ...homeTeam }, awayTeam: { ...awayTeam } }

      return merged
    });

    baseMatches.days = [];

    matches.matches.forEach((item) => {
      const day = moment(item.utcDate).startOf('day').format();
      const indexDay = _.findIndex(baseMatches.days, { utcDate: day });

      if (indexDay === -1) {
        baseMatches.days.push({
          utcDate: day,
          displayDate: moment(day).format('Do MMM'),
          displayDateFull: moment(day).format('Do MMM'),
          until: moment(day).toNow(),
          matches: [{ item }],
          groupedMatches: [
            {
              utcDate: item.utcDate,
              displayDate: moment(item.utcDate).format('hh:mm a'),
              displayDateFull: moment(item.utcDate).format('dddd Do MMMM - hh:mma'),
              until: moment(item.utcDate).toNow(),
              matches: [item]
            }
          ]
        });
      } else {
        baseMatches.days[indexDay].matches.push(item);

        const index = _.findIndex(baseMatches.days[indexDay].groupedMatches, { utcDate: item.utcDate });
        if (index === -1) {
          baseMatches.days[indexDay].groupedMatches.push({
            utcDate: item.utcDate,
            displayDate: moment(item.utcDate).format('hh:mm a'),
            displayDateFull: moment(item.utcDate).format('dddd Do MMMM - hh:mma'),
            until: moment(item.utcDate).toNow(),
            matches: [item]
          });
        } else {
          baseMatches.days[indexDay].groupedMatches[index].matches.push(item);
        }
      }
    });

    return baseMatches;
  }
}