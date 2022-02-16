const db = require("./db/connection");

exports.idExistReturnsObject = async (rows, id) => {
  const modelResults = await this.checkIDExistWithResultsReturnsArray(rows, id);
  return modelResults[0];
};

exports.articleIDExists = async (id) => {
  const result = await db.query(
    `SELECT author, article_id FROM articles WHERE article_id = $1`,
    [id]
  );
  return result.rows;
};

exports.checkIDExistWithResultsReturnsArray = async (rows, id) => {
  const articleID = await this.articleIDExists(id);
  const modelResults = rows;
  if (articleID.length === 0) {
    return Promise.reject({
      status: 404,
      msg: `Article ID does not exist for: ${id}`,
    });
  }
  return modelResults;
};

exports.idExistReturnsString = async (rows, id) => {
    const [modelResults] = await this.checkIDExistWithResultsReturnsArray(rows, id);
    return modelResults.body
}