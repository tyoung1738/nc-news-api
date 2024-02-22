const { getAllEndpoints } = require("./endpoints-controller");
const {getTopics} = require("../controllers/topics-controller")
const {getArticleByID, getArticles, patchArticle} = require("../controllers/articles-controller")
const {getCommentsByArticleID, postComment, deleteComment} = require('../controllers/comments-controller')
const {getUsers} = require('../controllers/users-controller')

module.exports = {getAllEndpoints, getTopics, getArticleByID, getArticles, getCommentsByArticleID, postComment, patchArticle, deleteComment, getUsers}