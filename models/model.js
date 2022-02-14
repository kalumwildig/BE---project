const db = require('../db/connection');


exports.getTopicModels = () => {
  return db.query(`SELECT * FROM topics`).then(({ rows }) => {
    return rows;
  });
};

exports.getArticleModel = (id) => {
    return db.query(`SELECT * FROM articles WHERE article_id = $1`, [id]).then(({ rows }) => {
        const user = rows[0];
      if (!user) {
        return Promise.reject({
          status: 404,
          msg: `No user found for user_id: ${id}`,
        });
      }
      return user;
      });
}