const Moment = require('moment');

const types = {
  Match: {
    time: async (match) => {
      const duration = Moment.duration(Moment.utc(match.utcDate).diff(Moment()));

      return {
        fromNow: Moment.utc(match.utcDate).fromNow(),
        hours: duration.get('hours'),
        minutes: duration.get('minutes'),
        days: duration.get('days')
      }
    }
  }
}

module.exports = {
  types
}