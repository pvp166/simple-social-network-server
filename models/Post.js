const {model, Schema} = require('mongoose');
const { modelName } = require('./User');

const postSchema = new Schema({
    body: String,
    username: String,
    createdAt: String,
    comments: [
        {
            body: String,
            username: String,
            createdAt: String,
        }
    ],
    likes: [
        {
            username: String,
            createdAt: String,
        }
    ],
    dislikes: [{
        username: String,
        createdAt: String,
    }],
    user: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    }

})
module.exports = model('Post', postSchema);