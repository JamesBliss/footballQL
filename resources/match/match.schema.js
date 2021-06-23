const queries = `
  nextMatchByID(id: Int!): MatchWithError
  nextMatchesByCompetition(id: Int, code: String): MatchesWithError
`;

const types = `
  type MatchesWithError {
    data: Matches
    errors: [Error]
  }
  type MatchWithError {
    data: Match
    errors: [Error]
  }
`;

module.exports = {
  queries,
  types
}