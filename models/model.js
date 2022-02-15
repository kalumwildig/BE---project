const db = require("../db/connection");
const { idExist } = require("../util_funcs");

exports.getTopicModels = () => {
  return db.query(`SELECT * FROM topics`).then(({ rows }) => {
    return rows;
  });
};

exports.getArticleModel = (id) => {
  return db
    .query(`SELECT * FROM articles WHERE article_id = $1`, [id])
    .then(({ rows }) => {
      return idExist(rows, id);
    });
};

exports.patchArticleModel = (id, body) => {
    return db
      .query(
        `UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *`,
        [body.inc_votes, id]
      )
      .then(({ rows }) => {
        return idExist(rows, id);
      });
};

exports.getUserModels = () => {
    console.log('get here')
    return db.query(`SELECT username FROM users`).then(({ rows }) => {
        return rows;
      });
}