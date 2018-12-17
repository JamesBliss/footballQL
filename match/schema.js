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
  type Goal {
    minute: Int
    extraTime: Int
    type: String
    team: Team
    scorer: Player
    assist: Player
  }
  type Booking {
    minute: Int
    team: Team
    player: Player
    card: String
  }
  type Substitution {
    minute: Int
    team: Team
    playerOut: Player
    playerIn: Player
  }
  type Match @cacheControl(maxAge: 240) {
    id: Int,
    competition: Competition
    season: Season
    utcDate: String
    status: String
    minute: Int
    attendance: Int
    venue: String
    matchday: Int
    stage: String
    group: String
    lastUpdated: String
    score: Score
    homeTeam: Team
    awayTeam: Team
    time: Time
    goals: [Goal]
    bookings: [Booking]
    substitutions: [Substitution]
  }
  type Matches @cacheControl(maxAge: 240) {
    matches: [Match]
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
  type MatchResponse {
    head2head: Head2head
    match: Match
  }

`;