const { StatusCodes } = require('http-status-codes')
const { BadRequestError } = require('../errors')
const  Post  = require('../models/Post')

const createPost = async  (req,res) => {
    const { title , description , username} = req.body
    let image=null , video=null
    let image_type=null,video_type=null
    req.files.forEach(element => {
        if (element.fieldname == 'image') {
            image = element.buffer
            image_type = element.mimetype
        }
        else if (element.fieldname == 'video') {
            video = element.buffer
            video_type = element.mimetype
        }
    });
    if (!title || !description || !username) {
        throw new BadRequestError("Please provide all credentials")
    }
    if (image != null && video !=null) {
        throw new BadRequestError("Provide image or video not both")
    }
    if ( image == null && video ==null) {
        throw new BadRequestError("Provide image or video")
    }
    const post = await Post.create({title,description,
        multimediaContent : image || video,
        multimediContentType : image_type || video_type,
        creatorUsername:username})
    res.status(StatusCodes.CREATED).send(post);
}

const getPost = async (req,res) => {
    const { id } = req.params;
    const post = await Post.findOne({_id:id})
    return res.send(post) 
}

const getAllUserPosts = async (req,res) => {
     const { username } = req.params
     let posts = await Post.find({
         creatorUsername:username
     })
     res.send(posts)
}

const deletePost = async (req,res) => {
    const { id } = req.params;
    const post = await Post.deleteOne({_id:id})
    return res.status(StatusCodes.OK).send(post)
}

const votePost = async (req,res) => {
    const { username } = req.body
    const { vote } = req.query
    const { id } = req.params
    if (!username || !vote || !id) {
        throw new BadRequestError("Please provide all credentials!")
    }
    let post = await Post.findById(id)
    if (!post) {
        throw new BadRequestError(`No post with ${id} id`)
    }
    let msg = {msg : "",success:false,post:post}
    if (post.upVoters.includes(username)) {
        msg.msg = "Already voted up!"
        return res.status(StatusCodes.NOT_ACCEPTABLE).send(msg)
    }
    if (post.downVoters.includes(username)) {
        msg.msg = "Already voted down!"
        return res.status(StatusCodes.NOT_ACCEPTABLE).send(msg)
    }
    if (vote == 'down') {
        post.downVoters.push(username)
        post.score -= 1;
    }
    else {
        post.upVoters.push(username)
        post.score += 1;
    }
    await post.save()
    msg.post = post
    msg.success = true
    res.send(msg)
}

const unvotePost = async (req,res) => {
    const { username } = req.body
    const { id } = req.params
    let post = await Post.findById(id)
    if (!username || !id) {
        throw new BadRequestError("Please provide all credentials!")
    }
    if (!post) {
        throw new BadRequestError(`No post with ${id} id`)
    }
    if (post.upVoters.includes(username)) {
        post.upVoters = post.upVoters.filter((user) => {
            return user != username
        })
        post.score -= 1;
    }
    if (post.downVoters.includes(username)) {
        post.downVoters = post.downVoters.filter((user) => {
            return user != username
        })
        post.score += 1;
    }
    await post.save()
    res.send(post)
}


module.exports = {
    createPost,
    getPost,
    getAllUserPosts ,
    deletePost,
    votePost,
    unvotePost
}