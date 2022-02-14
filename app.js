const express = require('express')
const {getTopics, getArticle} = require('./controllers/controller')

const app = express()

app.get('/api/topics', getTopics);

app.get('/api/articles/:article_id', getArticle)

app.all("/*", (req, res, next) => {
    res.status(404).send({ msg: "Path not found" });
  });

module.exports = app