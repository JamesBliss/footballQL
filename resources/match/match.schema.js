const queries = `
  match(id: Int!): MatchResponse
  nextMatch(id: Int!): Match
  upcomingMatches(id: Int!): Matches
  allMatches(id: Int!): Matches
  matches: Matches
`;

const types = `
  type MatchResponse {
    head2head: Head2head
    match: Match
    cached: String
  }
`;

module.exports = {
  queries,
  types
}