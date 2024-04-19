require('dotenv').config()
const Person = require("../models/personModel.js")
const Post = require("../models/postModel.js")


//----------------------- Add Post -----------------------
const addPost = async (request, response) => {
    try {
        const { caption, location, tags } = request.body;
        const person = await Person.findById({ _id: request.user.id });

        console.log("request body Add post--------", request.body);

        if (!caption || !location || !tags || typeof caption !== 'string' || typeof location !== 'string' || !Array.isArray(tags)) {
            return response.status(400).send({ status: false, message: "User Input Error" });
        }
        else if (!person) {
            return response.status(400).send({ status: false, message: 'User NOT Found' });
        }
        else {
            let imageId, imageName;
            if (request.file) {
                console.log('request file image----------------------', request.file)
                imageId = request.file.filename;
                imageName = request.file.originalname;
                console.log('imageId-------------', imageId)
                console.log('imageName-------------', imageName)
            }

            // creates an instance of post model
            const post = new Post({
                caption,
                location,
                tags,
                imageId,
                imageName,
                person: person._id
            });
            await post.save();

            person.posts.push(post._id);
            await person.save();

            return response.status(200).send({ status: true, message: 'Post Uploaded Successfully' });
        }
    } catch (error) {
        console.log('Error add post-------------------', error);
        return response.status(400).send({ status: false, message: 'Error in Posting' });
    }
}


//----------------------- Update Post -----------------------
const updatePost = async (request, response) => {
    try {
        console.log('update-------------------', request.body);
        const { caption, location, tags } = request.body;
        const postId = request.params.id;

        if (!postId) {
            return response.status(400).send({ status: false, message: "Error! params id missing" });
        }
        else if (!caption || !location || !tags || typeof caption !== 'string' || typeof location !== 'string' || !Array.isArray(tags)) {
            return response.status(400).send({ status: false, message: "User Input Error" });
        }
        else {
            const person = await Person.findById({ _id: request.user.id });
            const post = await Post.findById({ _id: postId });

            if (!person) {
                return response.status(400).send({ status: false, message: 'User NOT Found' });
            }
            else if (!post) {
                return response.status(400).send({ status: false, message: 'Post NOT Found' });
            }
            else if (post.person != person.id) {
                console.log("post.user-----------", post);
                console.log("person.id-----------", person.id);
                return response.status(400).send({ status: false, message: 'User have NO Access to update this post' });
            }
            else {
                let imageId, imageName;
                if (request.file) {
                    console.log('request file image----------------------', request.file)
                    imageId = request.file.filename;
                    imageName = request.file.originalname;
                }

                const postData = await Post.findByIdAndUpdate({ _id: postId }, {
                    $set: {
                        caption,
                        location,
                        tags,
                        imageId,
                        imageName,
                    }
                })

                console.log("Person Data----------------", postData)
                return response.status(200).send({ status: true, message: 'Post Updated Successfully' });
            }
        }
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
        else if (!post) {
            return response.status(400).send({ status: false, message: 'Post NOT Found' });
        }
        else if (post.person != person.id) {
            return response.status(400).send({ status: false, message: 'User have NO Access to delete this post' });
        }
        else {
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
        }
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
        else if (!post) {
            return response.status(400).send({ status: false, message: 'Post NOT Found' });
        }
        else if (post.person != person.id) {
            return response.status(400).send({ status: false, message: 'User have NO Access to Get this post' });
        }
        else {
            console.log('Post--------------------', post);
            return response.status(200).send({ status: true, message: 'Get Post Successful', data: post });
        }
    } catch (error) {
        console.log('Error get post-------------------', error);
        return response.status(400).send({ status: false, message: 'Error in Get Post' });
    }
};


//----------------------- Like Post -----------------------
const likePost = async (request, response) => {
    try {
        console.log('like post params-------------------', request.params.personId);
        const postId = request.params.personId;
        const person = await Person.findById({ _id: request.user.id });
        const post = await Post.findById({ _id: postId });
        if (!person) {
            return response.status(400).send({ status: false, message: 'User NOT Found' });
        }
        else if (!post) {
            return response.status(400).send({ status: false, message: 'Post NOT Found' });
        }
        else {
            let likesArray = post.likes;
            const indexPerson = likesArray.indexOf(person._id);
            if (indexPerson >= 0) {
                console.log('index-----------------', indexPerson);

                const x = likesArray.splice(indexPerson, 1);

                post.likes = likesArray;
                await post.save();

                const countLikes = likesArray.length;
                return response.status(200).send({ status: true, message: 'Post Unliked Successfully', data: countLikes });
            }
            else {
                post.likes.push(person._id);
                await post.save();

                let likesArray = post.likes;
                const countLikes = likesArray.length;
                return response.status(200).send({ status: true, message: 'Post Liked Successfully', data: countLikes });
            }
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
