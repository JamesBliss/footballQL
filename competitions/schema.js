module.exports = `
  type Slot {
    utcDate: String
    displayDate: String
    matches: [Match]
  }

  type Day {
    utcDate: String
    displayDate: String
    matches: [Match]
    groupedMatches: [Slot]
  }

  type CompetitionsResponse {
    id: Int
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
    competition: CompetitionsResponse
    matches: [Match]
  }
  type CompetitionTeamsResponse {
    count: Int
    competition: CompetitionsResponse
    season: Season
    teams: [Team]
  }
  type CompetitionStandingsResponse {
    competition: CompetitionsResponse
    season: Season
    standings: [StandingsType]
  }
  type competitionCurrentMatchdayResponse {
    count: Int
    competition: CompetitionsResponse
    matches: [Match]
    days: [ Day ]
  }
`;