module.exports = `
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