const db = require('../db/connection.js');


exports.getTopicModels = () => {
  return db.query(`SELECT * FROM topics`).then(({ rows }) => {
    return rows;
  });
};
