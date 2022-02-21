const User = require('../models/User')
const Post = require('../models/Post')
const { BadRequestError } = require('../errors') 

const search = async (req,res) => {
    const { query , type , filter} = req.query
    if (type == 'posts' || !type) {
        const date = new Date();
        let startDate;
        let month_change = 0
        let year_change = 0
        let day_change = 0
        if (filter == 'year') year_change = -1 
        else if (filter == 'month') month_change = -1
        else if (filter == 'week') day_change = -7
        else if (filter == 'day') day_change = -1 
        startDate = new Date(date.getFullYear() + year_change,date.getMonth() + month_change,date.getDate() + day_change)
        console.log(startDate);
        let queryObject = {
            "title" : {
                $regex: new RegExp(`${query}`) , $options:'i'
            }
        }
        if (filter) queryObject.dateCreated = {$gte:startDate}
        const posts  = await Post.find(queryObject)
        return res.send(posts)
    }
    else if (type == 'people') {
        const user = await User.find({
            "name" : query
        })
        return res.send(user)
    }
    throw new BadRequestError("Please provide all params!")
}

module.exports = search