const db = require("../db/connection");
const { idExist } = require("../util_funcs");

exports.getTopicModel = () => {
  return db.query(`SELECT * FROM topics;`).then(({ rows }) => {
    return rows;
  });
};

exports.getArticleModel = (id) => {
  return db
    .query(`SELECT a.*, COUNT(c.comment_id)::int AS comment_count FROM articles a FULL JOIN comments c ON a.article_id = c.article_id WHERE a.article_id = $1 GROUP BY a.article_id;`, [id])
    .then(({ rows }) => {
      return idExist(rows, id);
    });
};

exports.patchArticleModel = (id, body) => {
    return db
      .query(
        `UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *;`,
        [body.inc_votes, id]
      )
      .then(({ rows }) => {
        return idExist(rows, id);
      });
};

exports.getUserModel = () => {
    return db.query(`SELECT username FROM users;`).then(({ rows }) => {
        return rows;
      });
}

exports.getArticlesModel = () => {
    return db.query(`SELECT * FROM articles ORDER BY created_at DESC;`).then(({ rows }) => {
        return rows;
      });
}