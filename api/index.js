const fetch = require('node-fetch').default
const { GraphQLError } = require('graphql/error');
const cache = require('../cache');
var Color = require('color');

//
const ColorThief = require('./color-thief');
const colorThief = new ColorThief();

//
const ColorContrastChecker = require('./color-contrast-checker');
var ccc = new ColorContrastChecker();

//
const KEY = process.env.FOOTBALL_KEY;

module.exports = {
  getMatches: async (url) => {
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
  getMatch: async (url) => {
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

    // Sort by most common
    const commonColours = palette.sort((a, b) => a.count < b.count)

    // Add the text contrast
    const commonColorsWithContrast = commonColours.map((color) => {
      let textContrast = '#333'

      if (!ccc.isLevelAA(textContrast, new Color(color.rgb).hex(), 14)) {
        textContrast = '#fff';
      }

      return {
        ...color,
        hex: new Color(color.rgb).hex(),
        textContrast
      }
    });
    
    // Filter out near-white colours
    const filteredCommonColoursWithContrast = commonColorsWithContrast.filter(colour => {
      return !(colour.rgb[0] > 220 && colour.rgb[1] > 220 && colour.rgb[2] > 220);
    });

    if (data.errorCode) {
      throw new GraphQLError(
        {
          status: data.errorCode,
          text: data.message
        }
      );
    }

    const team = { ...data, colours: filteredCommonColoursWithContrast };
    cache.set(url, team);

    return team;
  }
}