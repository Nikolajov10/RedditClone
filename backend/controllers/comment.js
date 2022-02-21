const Comment = require('../models/Comment')
const { StatusCodes } = require('http-status-codes')
const { BadRequestError} = require('../errors') 

const createCommentOnPost = async (req,res) => {
    const postId = req.params.id
    const {username , text} = req.body
    if (!postId || !username || !text) {
        throw new BadRequestError("Please provide all credentials!")
    }
    const comment = await Comment.create({
        onPost:postId,
        creatorUsername:username,
        text,
    })
    res.status(StatusCodes.CREATED).send(comment)
}

const createCommentOnComment = async (req,res) => {
    const commentId = req.params.id
    const {username , text} = req.body
    if (!commentId || !username || !text) {
        throw new BadRequestError("Please provide all credentials!")
    }
    const comment = await Comment.create({
        onComment:commentId,
        creatorUsername:username,
        text,
    })
    res.status(StatusCodes.CREATED).send(comment)
}

const voteComment = async (req,res) => {
    const { id } = req.params
    const { vote } = req.query
    const { username } = req.body
    if (!username || !vote || !id) {
        throw new BadRequestError("Please provide all credentials!")
    }
    let comment = await Comment.findById(id)
    if (!comment) {
        throw new BadRequestError(`No comment with ${id} id`)
    }
    let msg = {msg : "",success:false,comment:comment}
    if (comment.downVoters.includes(username)) {
        msg.msg = "Already voted down!"
        return res.status(StatusCodes.NOT_ACCEPTABLE).send(msg)
    }
    if (comment.upVoters.includes(username)) {
        msg.msg = "Already voted up!"
        return res.status(StatusCodes.NOT_ACCEPTABLE).send(msg)
    }
    if (vote == 'down') {
        comment.downVoters.push(username)
        comment.score -= 1
    }
    else {
        comment.upVoters.push(username)
        comment.score += 1
    }
    await comment.save()
    msg.comment = comment
    msg.success = true
    res.send(msg)
}

const getAllUserComments = async (req,res) => {
    const { username } = req.params
    const { sort } = req.query
    let comments
    if (sort) {
        if (sort == 'best') {
        comments = await Comment.find({
        creatorUsername:username
            }).sort({'score':'desc'})
        }
    else if (sort =="recent") {
        comments = await Comment.find({
        creatorUsername:username
            }).sort({'dateCreated':'desc'})
        }
    else if (sort =="oldest") {
        comments = await Comment.find({
        creatorUsername:username
            }).sort({'dateCreated':'asc'})
        }
    } 
    else {
        comments = await Comment.find({
        creatorUsername:username })
    }
    return res.json(comments)
}

const unvoteComment = async (req,res) => {
    const { username } = req.body
    const { id } = req.params
    let comment= await Comment.findById(id)
    if (!username || !id) {
        throw new BadRequestError("Please provide all credentials!")
    }
    if (!comment) {
        throw new BadRequestError(`No comment with ${id} id`)
    }
    if (comment.upVoters.includes(username)) {
        comment.upVoters = comment.upVoters.filter((user) => {
            return user != username
        })
        comment.score -= 1;
    }
    if (comment.downVoters.includes(username)) {
        comment.downVoters = comment.downVoters.filter((user) => {
            return user != username
        })
        comment.score += 1;
    }
    await comment.save()
    res.send(comment)
}

const getComment = async (req,res) => {
    const { id } = req.params
    const comment = await Comment.findById(id);
    if (!comment) {
        throw new BadRequestError(`No comment with ${id} id`)
    }
    res.send(comment)
}

const deleteComment = async (req,res) => {
    const { id } = req.params
    const comment = await Comment.findByIdAndDelete(id)
    res.send(comment)
}

const getCommentsOnPost =  async (req,res) => {
    const { id } = req.params // post id
    const { sort } = req.query
    let comments
    if (sort) {
        if (sort == 'best') {
        comments = await Comment.find({
        onPost:id
            }).sort({'score':'desc'})
        }
    else if (sort =="recent") {
        comments = await Comment.find({
        onPost:id
            }).sort({'dateCreated':'desc'})
        }
    else if (sort =="oldest") {
        comments = await Comment.find({
        onPost:id
            }).sort({'dateCreated':'asc'})
        }
    }
    else {
        comments = await Comment.find({
        onPost:id})
    }
    res.send(comments)
}

const getCommentsOnComment = async (req,res) => {
    const { id } = req.params// comment id
    const { sort } = req.query
    let comments
    if (sort) {
        if (sort == 'best') {
        comments = await Comment.find({
        onComment:id
            }).sort({'score':'desc'})
        }
    else if (sort =="recent") {
        comments = await Comment.find({
        onComment:id
            }).sort({'dateCreated':'desc'})
        }
    else if (sort =="oldest") {
        comments = await Comment.find({
        onComment:id
            }).sort({'dateCreated':'asc'})
        }
    }
    else {
        comments = await Comment.find({
        onComment:id })
    }
    res.send(comments)
}


module.exports = {
    createCommentOnComment,
    createCommentOnPost,
    voteComment,
    getAllUserComments,
    unvoteComment,
    getComment,
    deleteComment,
    getCommentsOnPost,
    getCommentsOnComment
}