const devData = require('../data/development-data/index.js');
const testData = require('../data/test-data/index.js')
const seed = require('./seed.js');
const db = require('../connection.js');

const objData = { development: devData, test: testData };
const ENV = process.env.NODE_ENV || "development";
const data = objData[ENV];


const runSeed = () => {
  return seed(data).then(() => db.end());
};

runSeed();
