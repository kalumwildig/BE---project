const db = require("../db/connection");
const file = require('../endpoints.json')
const { doRowsExist } = require("../util_funcs");



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
      return doRowsExist(rows, id);
    });
};

exports.patchArticleModel = (id, body) => {
  return db
    .query(
      `UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *;`,
      [body.inc_votes, id]
    )
    .then(({ rows }) => {
      return rows[0];
    });
};

exports.getUserModel = () => {
  return db.query(`SELECT username FROM users;`).then(({ rows }) => {
    return rows;
  });
};

exports.getArticlesModel = (sort_by = "created_at", order = "DESC", topic) => {
  const fieldOptions = [
    "author",
    "title",
    "article_id",
    "topic",
    "created_at",
    "votes",
    "comment_count",
  ];
  const orderBy = ["ASC", "DESC"];
  if (!fieldOptions.includes(sort_by.toLowerCase())) {
    return Promise.reject({
      status: 400,
      msg: "Invalid sort by argument. This is a bad request",
    });
  }
  if (!orderBy.includes(order.toUpperCase())) {
    return Promise.reject({
      status: 400,
      msg: "Invalid order argument. This is a bad request",
    });
  }
  
  let query = `SELECT a.article_id, a.title, a.author, a.topic, a.created_at, a.votes, COUNT(c.comment_id)::int AS comment_count FROM articles a FULL JOIN comments c ON a.article_id = c.article_id`;
  if (topic) {
    query += ` WHERE a.topic = '${topic}'`;
  }
  query += ` GROUP BY a.article_id ORDER BY ${sort_by} ${order};`;
  return db.query(query).then(({ rows }) => {
    if (rows.length === 0) {
        return Promise.reject({
            status: 404,
            msg: "This topic does not exist",
          });
    }
    
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
      return rows;
    });
};

exports.deleteCommentModel = (id) => {
  return db
    .query(`DELETE FROM comments WHERE comment_id = $1`, [id])
    .then(({ rowCount }) => {
      if (rowCount == 0) {
        return Promise.reject({
          status: 404,
          msg: `No comment exists for: ${id}`,
        });

      }
    });
};

exports.postCommentModel = async (data, id, author) => {
  const check = Object.keys(data);
  if (check[0] == "username" && check[1] == "body") {
    const comment = data.body;
    const insert = [comment, author, id];
    return db
      .query(
        `INSERT INTO comments (body, author, article_id) VALUES ($1, $2, $3) RETURNING *;`,
        insert
      )
      .then(({ rows }) => {
        return rows[0];
      });
  }
    return Promise.reject({ status: 400, msg: "This is a bad request" });
  }


exports.getEndpointsModel = async () => {
    return file;
}
