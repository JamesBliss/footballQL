module.exports = `
  type Competition {
    id: Int
    name: String
  }
  type Season {
    id: Int
    startDate: String
    endDate: String
    currentMatchday: Int
    winner: String
  }
  type Time {
    days: Int
    hours: Int
    minutes: Int
  }
  type Result {
    homeTeam: Int
    awayTeam: Int
  }
  type Score {
    winner: String
    duration: String
    fullTime: Result
    halfTime: Result
    extraTime: Result
    penalties: Result
  }
  type Match @cacheControl(maxAge: 240) {
    id: Int,
    competition: Competition
    season: Season
    utcDate: String
    status: String
    matchday: Int
    score: Score
    homeTeam: Team
    awayTeam: Team
    time: Time
  }
  type Matches @cacheControl(maxAge: 240) {
    matches: [Match]
  }
`;