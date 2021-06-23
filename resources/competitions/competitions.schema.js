const queries = `
  competitionStandings(id: Int, code: String): CompetitionStandingsResponse
  competitionCurrentMatchday(id: Int, code: String): CompetitionCurrentMatchdayResponse
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
    cachedUntil: String
    name: String
    code: String
    emblemUrl: String
    lastUpdated: String
    currentSeason: Season
    seasons: [Season]
  }
  type CompetitionStandings {
    competition: CompetitionsResponse
    season: Season
    standings: [StandingsType]
    cached: String
    cachedUntil: String
  }

  type CompetitionStandingsResponse {
    errors: [Error]
    data: CompetitionStandings
  }

  type CompetitionCurrentMatchday {
    count: Int
    cached: String
    cachedUntil: String
    competition: CompetitionsResponse
    matches: [Match]
    days: [Day]
  }

  type CompetitionCurrentMatchdayResponse {
    errors: [Error]
    data: CompetitionCurrentMatchday
  }
`;

module.exports = {
  queries,
  types
}