const queries = `
  teamByID(id: Int!): TeamWithErrors
`;

const types = `
  type Team {
    cached: String
    cachedUntil: String
    id: Int
    name: String
    shortName: String
    tla: String
    crestUrl: String
    address: String
    phone: String
    website: String
    email: String
    founded: Int
    clubColors: String
    venue: String
    lastUpdated: String
  }

  type TeamWithErrors {
    errors: [Error]
    data: Team
  }
`;

module.exports = {
  queries,
  types
}