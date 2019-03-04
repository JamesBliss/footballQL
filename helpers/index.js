const cache = require('../cache');
const api = require('../api');
var Color = require('color');

const ColorContrastChecker = require('./color-contrast-checker');
var ccc = new ColorContrastChecker();

module.exports = {
  getData: async ({ url }) => {
    let data = cache.get(url);
    if (!data) {
      data = await api.get(url);
    }
    return data;
  },
  getTeamsData: async ({ url }) => {
    let data = cache.get(url);
    if (!data) {
      data = await api.getTeamsData(url);
    }
    return data;
  },
  commonColorsWithContrast: ({ palette }) => {
    // Sort by most common
    const commonColours = palette.sort((a, b) => a.count < b.count)

    // Add the text contrast
    return commonColours.map((color) => {
      let textContrast = '#333'

      if (!ccc.isLevelAA(textContrast, new Color(color.rgb).hex(), 10)) {
        textContrast = '#fff';
      }

      return {
        ...color,
        hex: new Color(color.rgb).hex(),
        textContrast
      }
    }).filter(colour => {
      return !(colour.rgb[0] > 220 && colour.rgb[1] > 220 && colour.rgb[2] > 220);
    });
  }
}