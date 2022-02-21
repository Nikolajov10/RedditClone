const express = require('express')
const router = express.Router()

const {
    createCommentOnComment,
    createCommentOnPost,
    getAllUserComments,
    voteComment,
    unvoteComment,
    getComment,
    deleteComment,
    getCommentsOnPost,
    getCommentsOnComment
} = require('../controllers/comment')

router.route('/:id').post(createCommentOnComment).get(getComment).delete(deleteComment)

router.route('/post/:id').post(createCommentOnPost).get(getCommentsOnPost)

router.get('/comments/:username',getAllUserComments)
router.get('/oncomment/:id',getCommentsOnComment)

router.patch('/vote/:id',voteComment)
router.patch('/unvote/:id',unvoteComment)


module.exports = router