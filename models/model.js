const db = require("../db/connection");
const {checkIDExistWithResultsReturnsArray, idExistReturnsObject } = require("../util_funcs");

exports.getTopicModel = () => {
  return db.query(`SELECT * FROM topics;`).then(({ rows }) => {
    return rows;
  });
};

exports.getArticleModel = (id) => {
  return db
    .query(
      `SELECT a.*, COUNT(c.comment_id)::int AS comment_count FROM articles a FULL JOIN comments c ON a.article_id = c.article_id WHERE a.article_id = $1 GROUP BY a.article_id;`,
      [id]
    )
    .then(({ rows }) => {
      return idExistReturnsObject(rows, id);
    });
};

exports.patchArticleModel = (id, body) => {
  return db
    .query(
      `UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *;`,
      [body.inc_votes, id]
    )
    .then(({ rows }) => {
      return idExistReturnsObject(rows, id);
    });
};

exports.getUserModel = () => {
  return db.query(`SELECT username FROM users;`).then(({ rows }) => {
    return rows;
  });
};

exports.getArticlesModel = (sort_by = 'created_at', order = 'DESC') => {
  const fieldOptions = ['author', 'title', 'article_id', 'topic', 'created_at', 'votes', 'comment_count']
  const orderBy = ['ASC', 'DESC']
  if (!fieldOptions.includes(sort_by.toLowerCase())) {return Promise.reject({ status: 400, msg: "Invalid sort by argument. This is a bad request" })};
  if (!orderBy.includes(order.toUpperCase())) {return Promise.reject({ status: 400, msg: "Invalid order argument. This is a bad request" })};
    return db
    .query(
      `SELECT a.*, COUNT(c.comment_id)::int AS comment_count FROM articles a FULL JOIN comments c ON a.article_id = c.article_id GROUP BY a.article_id ORDER BY a.${sort_by} ${order};`
    )
    .then(({ rows }) => {
      return rows;
    });
};


exports.getArticleCommentsModel = (id) => {
  return db
    .query(
      `SELECT comment_id, body, votes, author, created_at FROM comments WHERE article_id = $1;`,
      [id]
    )
    .then(({ rows }) => {
      return checkIDExistWithResultsReturnsArray(rows, id);
    });
};
