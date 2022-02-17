const {
  getTopicModel,
  getArticleModel,
  patchArticleModel,
  getUserModel,
  getArticlesModel,
  getArticleCommentsModel,
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

exports.getArticles = async (req, res, next) => {
  try {
    const sort_by = req.query.sort_by;
    const order = req.query.order;
    const articles = await getArticlesModel(sort_by, order);
    res.status(200).send({ articles });
  } catch (err) {
    next(err);
  }
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
