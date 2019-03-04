const cache = require('../cache');
const api = require('../api');

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

    console.log({commonColours})

    // Add the text contrast
    const thing = commonColours.map((color) => {
      let textContrast = '#333'

      debugger;
      if (!ccc.isLevelAA(textContrast, new Color(color.rgb).hex(), 10)) {
        textContrast = '#fff';
      }

      return {
        ...color,
        hex: new Color(color.rgb).hex(),
        textContrast
      }
    });

    const another = thing.filter(colour => {
      return !(colour.rgb[0] > 220 && colour.rgb[1] > 220 && colour.rgb[2] > 220);
    });

    console.log({ another })

    return another;
  }
}