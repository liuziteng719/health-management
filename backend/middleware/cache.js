const redis = require('redis');
const { promisify } = require('util');

const client = redis.createClient(process.env.REDIS_URL);
const getAsync = promisify(client.get).bind(client);
const setAsync = promisify(client.set).bind(client);

const cache = async (req, res, next) => {
  try {
    const key = req.originalUrl;
    const cachedResponse = await getAsync(key);

    if (cachedResponse) {
      return res.json(JSON.parse(cachedResponse));
    }

    res.sendResponse = res.json;
    res.json = async (body) => {
      await setAsync(key, JSON.stringify(body), 'EX', 3600);
      res.sendResponse(body);
    };
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = cache; 