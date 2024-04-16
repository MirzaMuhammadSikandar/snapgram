require('dotenv').config()
const Person = require("../models/personModel.js")
const Post = require("../models/postModel.js")


//----------------------- Add Post -----------------------
const addPost = async (request, response) => {
    try {
        const { title, caption } = request.body;

        console.log("request body Add post--------", request.body);

        if (!title || !caption || typeof title !== 'string' || typeof caption !== 'string') {
            return response.status(400).send({ status: false, message: "User Input Error" });
        }

        const person = await Person.findById({ _id: request.user.id });
        if (!person) {
            return response.status(400).send({ status: false, message: 'User NOT Found' });
        }

        // creates an instance of post model
        const post = new Post({
            title,
            caption,
            person: person._id
        });
        await post.save();

        person.posts.push(post._id);
        await person.save();

        return response.status(200).send({ status: true, message: 'Post Uploaded Successfully' });
    } catch (error) {
        console.log('Error add post-------------------', error);
        return response.status(400).send({ status: false, message: 'Error in Posting' });
    }
}


//----------------------- Update Post -----------------------
const updatePost = async (request, response) => {
    try {
        console.log('update-------------------', request.body);
        const postId = request.params.id;

        if (!postId) {
            return response.status(400).send({ status: false, message: "Error! params id missing" });
        }

        const { title, description } = request.body;

        console.log("req.body--------", request.body);

        if (!title || !description || typeof title !== 'string' || typeof description !== 'string') {
            return response.status(400).send({ status: false, message: "User Input Error" });
        }


        const person = await Person.findById({ _id: request.user.id });
        const post = await Post.findById({ _id: postId });

        if (!person) {
            return response.status(400).send({ status: false, message: 'User NOT Found' });
        }
        if (!post) {
            return response.status(400).send({ status: false, message: 'Post NOT Found' });
        }
        if (post.user != person.id) {
            return response.status(400).send({ status: false, message: 'User have NO Access to update this post' });
        }
        const postData = await Task.findByIdAndUpdate({ _id: postId }, {
            $set: {
                title,
                description
            }
        })

        return response.status(200).send({ status: true, message: 'Post Updated Successfully' });
    } catch (error) {
        console.log('Error read-------------------', error);
        return response.status(400).send({ status: false, message: 'Error in updating Post' });
    }
};

//----------------------- Delete Post -----------------------
const deletePost = async (request, response) => {
    try {
        console.log('delete-------------------');
        const postId = request.params.id;
        const person = await Person.findById({ _id: request.user.id });
        const post = await Post.findById({ _id: postId });
        if (!person) {
            return response.status(400).send({ status: false, message: 'User NOT Found' });
        }
        if (!post) {
            return response.status(400).send({ status: false, message: 'Post NOT Found' });
        }
        if (post.person != person.id) {
            return response.status(400).send({ status: false, message: 'User have NO Access to delete this post' });
        }
        postArray = person.posts;
        await Post.deleteOne({ _id: postId });
        const index = postArray.indexOf(postId);

        console.log('index-----------------', index);

        const x = postArray.splice(index, 1);

        person.posts = postArray;
        await person.save();

        console.log(`myArray values: ${postArray}`);
        console.log(`variable x value: ${x}`);

        return response.status(200).send({ status: true, message: 'Post Deleted Successfully' });
    } catch (error) {
        console.log('Error read-------------------', error);
        return response.status(400).send({ status: false, message: 'Error in deleting Post' });
    }
};

//----------------------- Get Post -----------------------
const getPost = async (request, response) => {
    try {
        console.log('get post params-------------------', request.params.id);
        const postId = request.params.id;
        const person = await Person.findById({ _id: request.user.id });
        const post = await Post.findById({ _id: postId });
        if (!person) {
            return response.status(400).send({ status: false, message: 'User NOT Found' });
        }
        if (!post) {
            return response.status(400).send({ status: false, message: 'Post NOT Found' });
        }
        if (post.person != person.id) {
            return response.status(400).send({ status: false, message: 'User have NO Access to Get this post' });
        }

        console.log('Post--------------------', post);
        return response.status(200).send({ status: true, post });

    } catch (error) {
        console.log('Error get post-------------------', error);
        return response.status(400).send({ status: false, message: 'Error in Get Post' });
    }
};


//----------------------- Like Post -----------------------
const likePost = async (request, response) => {
    try {
        console.log('like post params-------------------', request.params.id);
        const postId = request.params.id;
        const person = await Person.findById({ _id: request.user.id });
        const post = await Post.findById({ _id: postId });
        if (!person) {
            return response.status(400).send({ status: false, message: 'User NOT Found' });
        }
        if (!post) {
            return response.status(400).send({ status: false, message: 'Post NOT Found' });
        }
        if (post.person != person.id) {
            return response.status(400).send({ status: false, message: 'User have NO Access to like this post' });
        }
        likesArray = post.likes;
        const indexPerson = likesArray.indexOf(person._id);
        if (indexPerson >= 0) {
            console.log('index-----------------', indexPerson);

            const x = likesArray.splice(indexPerson, 1);

            post.likes = likesArray;
            await post.save();
            return response.status(200).send({ status: true, message: 'Post Unliked Successfully' });
        }
        else{
            post.likes.push(person._id);
            await post.save();
            return response.status(200).send({ status: true, message: 'Post Liked Successfully' });
        }
    } catch (error) {
        console.log('Error like post-------------------', error);
        return response.status(400).send({ status: false, message: 'Error in liking Post' });
    }
};

module.exports = {
    addPost,
    updatePost,
    deletePost,
    getPost,
    likePost
}
