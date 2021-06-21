const queries = `
  competition(id: Int, code: String): CompetitionsResponse
  competitionMatches(id: Int, code: String, matchday: Int): CompetitionMatchesResponse
  competitionTeams(id: Int, code: String): CompetitionTeamsResponse
  competitionStandings(id: Int, code: String, filter: String): CompetitionStandingsResponse
  competitionCurrentMatchday(id: Int, code: String): competitionCurrentMatchdayResponse
`;

const types = `
  type Slot {
    utcDate: String
    displayDate: String
    displayDateFull: String
    until: String
    matches: [Match]
  }

  type Day {
    utcDate: String
    displayDate: String
    displayDateFull: String
    until: String
    matches: [Match]
    groupedMatches: [Slot]
  }

  type CompetitionsResponse {
    id: Int
    cached: String
    name: String
    code: String
    emblemUrl: String
    lastUpdated: String
    area: Area
    currentSeason: Season
    seasons: [Season]
  }
  type CompetitionMatchesResponse {
    count: Int
    cached: String
    competition: CompetitionsResponse
    matches: [Match]
  }
  type CompetitionTeamsResponse {
    count: Int
    cached: String
    competition: CompetitionsResponse
    season: Season
    teams: [Team]
  }
  type CompetitionStandingsResponse {
    competition: CompetitionsResponse
    season: Season
    standings: [StandingsType]
    cached: String
  }
  type competitionCurrentMatchdayResponse {
    count: Int
    cached: String
    competition: CompetitionsResponse
    matches: [Match]
    days: [ Day ]
  }
`;

module.exports = {
  queries,
  types
}