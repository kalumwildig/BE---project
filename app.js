const express = require('express')
const {getTopics, getArticle, patchArticle, getUsers, getArticles, getArticleComments, deleteComment} = require('./controllers/controller')
const {customError, PSQLErrors} = require('./controllers/errorcontroller')

const app = express()
app.use(express.json())

//GETS
app.get('/api/topics', getTopics);
app.get('/api/articles', getArticles)
app.get('/api/articles/:article_id', getArticle)
app.get('/api/users', getUsers)
app.get('/api/articles/:article_id/comments', getArticleComments)

//PATCH'S
app.patch('/api/articles/:article_id', patchArticle)

//DELETES
app.delete('/api/comments/:comment_id', deleteComment)


//ERRORS
app.all("/*", (req, res, next) => {
    res.status(404).send({ msg: "Path not found" });
  });

app.use(customError);
app.use(PSQLErrors);

module.exports = app