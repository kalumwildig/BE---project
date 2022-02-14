const {getTopicModels, getArticleModel} = require('../models/model')

exports.getTopics = async (req, res) => {
   const topics = await getTopicModels()
   res.status(200).send({topics})
}

exports.getArticle = async (req, res, next) => {
   try { const id = req.params.article_id
    const article = await getArticleModel(id)
    res.status(200).send({article});}
    catch (err) {
        console.log(err)
        next(err)
    }
}