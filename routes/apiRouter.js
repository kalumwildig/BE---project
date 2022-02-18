const apiRouter = require('express').Router();
const usersRouter = require('./usersRouter');
const commentsRouter = require('./commentsRouter')
const articlesRouter = require('./articleRouter')
const topicRouter = require('./topicsRouter')
const {getEndpoints} = require('../controllers/controller')

apiRouter.get('/', getEndpoints)
apiRouter.use('/users', usersRouter)
apiRouter.use('/comments', commentsRouter)
apiRouter.use('/articles', articlesRouter)
apiRouter.use('/topics', topicRouter)

module.exports = apiRouter;