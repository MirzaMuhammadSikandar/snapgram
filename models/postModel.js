const mongoose = require('mongoose')
const Person = require('./personModel.js')

const postSchema = new mongoose.Schema({
    title: { type: String, default: null },
    time: { type: String, default: null },
    location: { type: String, default: null },
    caption: { type: String, default: null },
    tags: [{ type: String, default: null }],
    imageId: { type: String, default: null},
    imageName: { type: String, default: null},
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Person" }],
    person: { type: mongoose.Schema.Types.ObjectId, ref: "Person" }
})

const Post = mongoose.model('post', postSchema);

module.exports = Post;