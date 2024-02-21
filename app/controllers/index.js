const { getAllEndpoints } = require("./endpoints-controller");
const {getTopics} = require("../controllers/topics-controller")
const {getArticleByID, getArticles} = require("../controllers/articles-controller")
const {getCommentsByArticleID, postComment} = require('../controllers/comments-controller')

module.exports = {getAllEndpoints, getTopics, getArticleByID, getArticles, getCommentsByArticleID, postComment}