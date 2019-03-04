const fetch = require('node-fetch').default
const { GraphQLError } = require('graphql/error');
const cache = require('../cache');
var Color = require('color');

const calculateRatio = require('../helpers/color-contrast-checker');
// var ccc = new ColorContrastChecker();

// const { commonColorsWithContrast } = require('../helpers');

//
const ColorThief = require('../helpers/color-thief');
const colorThief = new ColorThief();

//
const KEY = process.env.FOOTBALL_KEY;

const commonColorsWithContrast = ({ palette }) => {
  // Sort by most common
  const commonColours = palette.sort((a, b) => a.count < b.count)

  // Add the text contrast
  return commonColours.map((color) => {
    let textContrast = '#333333'

    const output = calculateRatio({ r: 51, g: 51, b: 51 }, { r: color.rgb[0], g: color.rgb[1], b: color.rgb[2] });

    if (output < 5) {
      textContrast = '#ffffff';
    }

    return {
      ...color,
      hex: new Color(color.rgb).hex(),
      textContrast
    }
  }).filter(colour => {
    return !(colour.rgb[0] > 240 && colour.rgb[1] > 240 && colour.rgb[2] > 240);
  });
};

module.exports = {
  get: async (url) => {
    const res = await fetch(url, { headers: { "X-Auth-Token": KEY } });
    const data = await res.json();

    if (data.errorCode) {
      throw new GraphQLError(
        {
          status: data.errorCode,
          text: data.message
        }
      );
    }
    cache.set(url, data);

    return data;
  },
  getTeam: async (url) => {
    const res = await fetch(url, { headers: { "X-Auth-Token": KEY } });
    const data = await res.json();
    const imageRes = await fetch(data.crestUrl);

    // Get the colour palette
    const buffer = await imageRes.buffer();
    const palette = colorThief.getPalette(buffer);
    const teamPalette = commonColorsWithContrast({palette});

    if (data.errorCode) {
      throw new GraphQLError(
        {
          status: data.errorCode,
          text: data.message
        }
      );
    }

    const team = { ...data, colours: teamPalette };
    cache.set(url, team);

    return team;
  },
  getTeamsData: async (url) => {
    const res = await fetch(url, { headers: { "X-Auth-Token": KEY } });
    const data = await res.json();

    const promises = data.teams.map(team => {
      return new Promise(async (res, rej) => {
        const imageRes = await fetch(team.crestUrl);

        // Get the colour palette
        const buffer = await imageRes.buffer();
        const palette = colorThief.getPalette(buffer);
        const teamPalette = commonColorsWithContrast({palette});

        res({ ...team, colours: teamPalette });
      });
    });

    const colourAddition = await Promise.all(promises);
    const mergedData = {
      ...data,
      teams: {
        ...data.teams,
        ...colourAddition
      }
    }

    if (data.errorCode) {
      throw new GraphQLError(
        {
          status: data.errorCode,
          text: data.message
        }
      );
    }

    cache.set(url, mergedData);

    return mergedData;
  }
}