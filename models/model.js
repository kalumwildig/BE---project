const db = require('../db/connection');


exports.getTopicModels = () => {
  return db.query(`SELECT * FROM topics`).then(({ rows }) => {
    return rows;
  });
};

exports.getArticleModel = (id) => {
    return db.query(`SELECT * FROM articles WHERE article_id = $1`, [id]).then(({ rows }) => {
        return rows[0];
      });
}