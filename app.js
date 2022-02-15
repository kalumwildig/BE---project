const express = require('express')
const {getTopics, getArticle, patchArticle, getUsers} = require('./controllers/controller')
const {customError, PSQLErrors} = require('./controllers/errorcontroller')

const app = express()
app.use(express.json())

//GETS
app.get('/api/topics', getTopics);
app.get('/api/articles/:article_id', getArticle)
app.get('/api/users', getUsers)


//PATCH'S
app.patch('/api/articles/:article_id', patchArticle)


//ERRORS
app.all("/*", (req, res, next) => {
    res.status(404).send({ msg: "Path not found" });
  });

app.use(customError);
app.use(PSQLErrors);

module.exports = app