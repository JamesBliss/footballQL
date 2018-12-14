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
  type Team {
    id: Int
    area: Area
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
    squad: [Squad]
    lastUpdated: String
  }
`;