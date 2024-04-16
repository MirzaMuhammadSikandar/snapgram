const mongoose = require('mongoose')
const Post = require('./postModel.js')

const PersonSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, default: null },
    username: { type: String, default: null },
    imageId: { type: String, default: null},
    imageName: { type: String, default: null},
    otp: { type: Number, default: 0 },
    verified: { type: Boolean, default: false },
    saved: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
    // liked: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
    posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }]
})

const Person = mongoose.model('person', PersonSchema);

module.exports = Person;