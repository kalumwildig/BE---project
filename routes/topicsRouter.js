const topicRouter = require('express').Router();
const { getTopics } = require('../controllers/controller')

topicRouter.get('/', getTopics)

module.exports = topicRouter;