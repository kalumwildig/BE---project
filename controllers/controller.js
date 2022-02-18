const {
  getTopicModel,
  getArticleModel,
  patchArticleModel,
  getUserModel,
  getArticlesModel,
  getArticleCommentsModel,
  getEndpointsModel
  deleteCommentModel,
  postCommentModel
} = require("../models/model");


exports.getTopics = async (req, res) => {
  const topics = await getTopicModel();
  res.status(200).send({ topics });
};

exports.getArticle = async (req, res, next) => {
  try {
    const id = req.params.article_id;
    const article = await getArticleModel(id);
    res.status(200).send({ article });
  } catch (err) {
    next(err);
  }
};

exports.patchArticle = async (req, res, next) => {
  try {
    const body = req.body;
    const id = req.params.article_id;
    const outcome = await Promise.all([getArticleModel(id) ,patchArticleModel(id, body)])
    const article = outcome[1]
    res.status(201).send({ article });
  } catch (err) {
    next(err);
  }
};

exports.getUsers = async (req, res) => {
  const users = await getUserModel();
  res.status(200).send({ users });
};


exports.getArticles = async (req, res, next) => {
  try {
    const sort_by = req.query.sort_by;
    const order = req.query.order;
    const topic = req.query.topic;
    const articles = await getArticlesModel(sort_by, order, topic);
    res.status(200).send({ articles });
  } catch (err) {
    next(err);
  }
};

exports.getArticleComments = async (req, res, next) => {

  try {
    const id = req.params.article_id;
    const outcome = await Promise.all([getArticleModel(id), getArticleCommentsModel(id)])
    const comments = outcome[1]
    res.status(200).send({ comments });
  } catch (err) {
    next(err);
  }
};

exports.deleteComment = async (req, res, next) => {
   try { const id = req.params.comment_id
  await deleteCommentModel(id)
   res.sendStatus(204)
   }
   catch (err) {
       next(err)
   }
}

exports.postComment = async (req, res, next) => {
  try {
    const commentToAdd = req.body;
    const id = req.params.article_id;
    const {author} = await getArticleModel(id)
    const comment = await postCommentModel(commentToAdd, id, author)
    res.status(201).send({comment})
  } catch (err) {
    next(err);
  }
};

exports.getEndpoints = async (req, res) => {
    const endpoints = await getEndpointsModel()
    res.status(200).send({endpoints})

}
