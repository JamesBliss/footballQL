const Redis = require("ioredis");

const REDIS_KEY = process.env.REDIS_KEY;

module.exports = new Redis(REDIS_KEY);