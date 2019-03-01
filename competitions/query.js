module.exports = `
  competition(id: Int!): CompetitionsResponse
  competitionMatches(id: Int!, matchday: Int): CompetitionMatchesResponse
  competitionTeams(id: Int!): CompetitionTeamsResponse
  competitionStandings(id: Int!): CompetitionStandingsResponse
  competitionCurrentMatchday(id: Int!): competitionCurrentMatchdayResponse
`;