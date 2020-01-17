const fetch = require('node-fetch').default
const { GraphQLError } = require('graphql/error');
const cache = require('../cache');
const getColors = require('get-image-colors')

const findIndex = require('lodash/findIndex');
//
const KEY = process.env.FOOTBALL_KEY;

const commonColorsWithContrast = (palette) => {
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

const getColours = async (buffer) => {
  let pallet;
  await getColors(buffer, 'image/svg+xml').then(colors => {
    const colours = [];

    console.log({ colours });

    colors.forEach(color => {
      const rgb = color.rgb()
      const hex = color.hex()
      const foundIndex = findIndex(colours, { hex: hex })
      if (foundIndex > -1) {
        colours[foundIndex].count++;
      } else {
        colours.push({
          rgb: rgb,
          hex: hex,
          count: 1
        })
      }
    });
    console.log(colours)
    pallet = commonColorsWithContrast(colours);
    return true;
  });
  return pallet;
}

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
    cache.set(url, { ...data, ...{ cached: new Date() } });

    return data;
  },
  getTeam: async (url) => {
    const res = await fetch(url, { headers: { "X-Auth-Token": KEY } });
    const data = await res.json();
    const imageRes = await fetch(data.crestUrl);

    // Get the colour palette
    // const buffer = await imageRes.buffer();
    // const teamPalette = await getColours(buffer);
    // console.log(teamPalette)
    const teamPalette = null

    if (data.errorCode) {
      throw new GraphQLError(
        {
          status: data.errorCode,
          text: data.message
        }
      );
    }

    const team = { ...data, colours: teamPalette };
    cache.set(url, { ...team, ...{ cached: new Date() } });

    return team;
  },
  getTeamsData: async (url) => {
    const res = await fetch(url, { headers: { "X-Auth-Token": KEY } });
    const data = await res.json();

    const promises = data.teams.map(team => {
      return new Promise(async (res, rej) => {
        res(team)
        if (!team.crestUrl) {
          const imageRes = await fetch(team.crestUrl);
          if (imageRes.status === 200) {
            // Get the colour palette
            const buffer = await imageRes.buffer();
            const teamPalette = await getColours(buffer);

            res({ ...team, colours: teamPalette });
          } else {
            res(team);
          }
        } else {
          res(team);
        }
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

    cache.set(url, { ...mergedData, ...{ cached: new Date() } });

    return mergedData;
  }
}