const {getTopicModels} = require('../models/model')

exports.getTopics = async (req, res) => {
   const topics = await getTopicModels()
   res.status(200).send({topics})
}