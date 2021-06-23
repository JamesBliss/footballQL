const types = `
  type Error {
    call: String
    message: String
    errorCode: Int
  }
  type Competition {
    id: Int
    name: String
  }
  type Time {
    days: Int
    hours: Int
    minutes: Int
    fromNow: String
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
    id: Int
    cached: String
    cachedUntil: String
    competition: Competition
    season: Season
    utcDate: String
    status: String
    minute: Int
    matchday: Int
    stage: String
    group: String
    lastUpdated: String
    score: Score
    homeTeam: Team
    awayTeam: Team
    time: Time
  }
  type Matches {
    matches: [Match]
    cached: String
    cachedUntil: String
  }
  type Head2headResult {
    wins: Int
    draws: Int
    losses: Int
  }
  type Head2head {
    numberOfMatches: Int
    totalGoals: Int
    homeTeam: Head2headResult
    awayTeam: Head2headResult
  }
  type Season {
    id: Int
    startDate: String
    endDate: String
    currentMatchday: Int
    winner: String
  }
  type TablePosition {
    position:  Int
    team: Team
    playedGames:  Int
    won: Int
    draw: Int
    lost: Int
    points: Int
    goalsFor: Int
    goalsAgainst:  Int
    goalDifference: Int
  }
  type StandingsType {
    startDate: String
    type: String
    group: String
    table: [TablePosition]
  }
`;

module.exports = {
  types,
};
