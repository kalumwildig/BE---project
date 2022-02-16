const db = require("./db/connection");

exports.idExist = async (rows, id) => {
  const articleID = await this.articleIDExists(id);
  const modelResults = rows;
  if (modelResults.length === 0 && articleID.length === 0) {
    return Promise.reject({
      status: 404,
      msg: `No ID found for: ${id}`,
    });
  }

  return modelResults.length === 1 ? modelResults[0] : modelResults;
};

exports.articleIDExists = async (id) => {
  const result = await db.query(
    `SELECT article_id FROM articles WHERE article_id = $1`,
    [id]
  ); 
  return result.rows;
};
