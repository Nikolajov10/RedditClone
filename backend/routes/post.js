const express = require('express')
const router = express.Router()
const {
    createPost, 
    deletePost,
    getPost,
    getAllUserPosts,
    votePost,
    unvotePost
} = require('../controllers/post')

const upload = require('multer')();

router.post('/create',upload.any(),createPost)

router.get('/:id',getPost)
router.get('/getAll/:username',getAllUserPosts)

router.patch('/vote/:id',votePost)
router.patch('/unvote/:id',unvotePost)

router.delete('/delete/:id',deletePost)

module.exports = router