module.exports = `
  type Squad {
    id: Int
    name: String
    position: String
    dateOfBirth: String
    countryOfBirth: String
    nationality: String
    role: String
  }
  type Area {
    id: Int
    name: String
  }
  type Coach {
    id: Int
    name: String
    countryOfBirth: String
    nationality: String
  }
  type Captain {
    id: Int
    name: String
    shirtNumber: Int
  }
  type Player {
    id: Int
    name: String
    position: String
    shirtNumber: Int
  }
  type Lineup {
    players: [Player]
  }
  type Competition {
    id: Int
    name: String
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