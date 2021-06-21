const cache = require('../cache');
const api = require('../cache/api');

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
  }
}