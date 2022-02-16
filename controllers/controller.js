const {
  getTopicModel,
  getArticleModel,
  patchArticleModel,
  getUserModel,
  getArticlesModel,
  getArticleCommentsModel,
  postCommentModel,
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
    const article = await patchArticleModel(id, body);
    res.status(201).send({ article });
  } catch (err) {
    next(err);
  }
};

exports.getUsers = async (req, res) => {
  const users = await getUserModel();
  res.status(200).send({ users });
};

exports.getArticles = async (req, res) => {
  const articles = await getArticlesModel();
  res.status(200).send({ articles });
};

exports.getArticleComments = async (req, res, next) => {
  try {
    const id = req.params.article_id;
    const comments = await getArticleCommentsModel(id);
    res.status(200).send({ comments });
  } catch (err) {
    next(err);
  }
};

exports.postComment = async (req, res, next) => {
  try {
    const commentToAdd = req.body.body;
    const id = req.params.article_id;
    const comment = await postCommentModel(commentToAdd, id);
    res.status(201).send({comment})
  } catch (err) {
    next(err);
  }
};
