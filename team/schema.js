module.exports = `
  type Colour {
    rgb: [Int]
    count: Int
    hex: String
    textContrast: String
    cached: String
  }
  type Team {
    cached: String
    id: Int
    area: Area
    name: String
    coach: Coach
    captain: Captain
    lineup: Lineup
    bench: Lineup
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
    colours: [Colour]
  }
`;