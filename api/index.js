const fetch = require('node-fetch').default
const { GraphQLError } = require('graphql/error');
const cache = require('../cache');
var Color = require('color');
const { commonColorsWithContrast } = require('../helpers');

//
const ColorThief = require('../helpers/color-thief');
const colorThief = new ColorThief();

//
const ColorContrastChecker = require('../helpers/color-contrast-checker');
var ccc = new ColorContrastChecker();

//
const KEY = process.env.FOOTBALL_KEY;

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

    console.log('hello');

    // Get the colour palette
    const buffer = await imageRes.buffer();
    const palette = colorThief.getPalette(buffer);
    const teamPalette = commonColorsWithContrast({palette});

    console.log('hello world', teamPalette)

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

        console.log('hello')
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