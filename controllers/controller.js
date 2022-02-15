const res = require("express/lib/response");
const {
  getTopicModels,
  getArticleModel,
  patchArticleModel,
  getUserModels,
} = require("../models/model");

exports.getTopics = async (req, res) => {
  const topics = await getTopicModels();
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
  const users = await getUserModels();
  res.status(200).send({ users });
};
