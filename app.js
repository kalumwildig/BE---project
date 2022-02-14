const express = require('express')
const {getTopics, getArticle} = require('./controllers/controller')
const {customError, PSQLErrors} = require('./controllers/errorcontroller')

const app = express()

//GETS
app.get('/api/topics', getTopics);
app.get('/api/articles/:article_id', getArticle)



//Errors
app.all("/*", (req, res, next) => {
    res.status(404).send({ msg: "Path not found" });
  });

app.use(customError);
app.use(PSQLErrors);

module.exports = app