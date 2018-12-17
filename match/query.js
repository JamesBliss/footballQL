module.exports = `
  match(id: Int!): MatchResponse
  nextMatch(id: Int!): Match
  upcomingMatches(id: Int!): Matches
  allMatches(id: Int!): Matches
`;