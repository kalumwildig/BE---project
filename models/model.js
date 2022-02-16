const db = require("../db/connection");
const {checkIDExistWithResultsReturnsArray, idExistReturnsObject, articleIDExists, idExistReturnsString } = require("../util_funcs");

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

exports.getArticlesModel = () => {
  return db
    .query(
      `SELECT a.*, COUNT(c.comment_id)::int AS comment_count FROM articles a FULL JOIN comments c ON a.article_id = c.article_id GROUP BY a.article_id ORDER BY a.created_at DESC;`
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

exports.postCommentModel = async (comment, id) => {
    const results = await articleIDExists(id) ;
    if (results.length === 0) { return Promise.reject({
        status: 404,
        msg: `Article ID does not exist for: ${id}`,
      }); }
    else {
    const [{author}] = results 
    const insert = [comment, author ,id];
    return db.query(`INSERT INTO comments (body, author, article_id) VALUES ($1, $2, $3) RETURNING *;`, insert).then(({rows}) => {
        return idExistReturnsString(rows, id)
    } )}
}