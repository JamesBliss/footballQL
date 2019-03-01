const { getData, getTeamsData } = require('../helpers/index');
const _ = require('lodash')

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

      const merged = {...item, homeTeam: { ...homeTeam }, awayTeam: { ...awayTeam }}

      return merged
    })

    return baseMatches;
  }
}