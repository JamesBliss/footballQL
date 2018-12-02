module.exports = `
  type Competition {
    id: Int
    name: String
  }
  type Season {
    id: Int
    startDate: Int
    endDate: Int
    currentMatchday: Int
    winner: String
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
  type Match {
    id: Int,
    competition: Competition
    season: Season
    status: String
    matchday: Int
    score: Score
    homeTeam: Team
    awayTeam: Team
  }
`;