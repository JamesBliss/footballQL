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
  type Colour {
    rgb: [Int]
    count: Int
    hex: String
    textContrast: String
  }
  type Team {
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