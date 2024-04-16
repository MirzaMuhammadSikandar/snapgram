require('dotenv').config()
const crypto = require('crypto')
const jwt = require('jsonwebtoken')
const Person = require('../models/personModel.js')
const Post = require("../models/postModel.js")
const { generateAccessToken, generateRefreshToken } = require('../helperFunctions/tokens.js')
const { generateOTP } = require('../helperFunctions/otherFunctions.js')

let refreshTokens = []

//----------------------- Registration -----------------------
const registration = async (request, response) => {
    const { name, username, email, password: plainTextPassword } = request.body;
    console.log("registration request body---------------------", request.body);
    if (!name || !username || !email || !plainTextPassword || typeof name !== 'string' || typeof username !== 'string' || typeof email !== 'string' || typeof plainTextPassword !== 'string') {
        return response.status(400).send({ status: false, message: "User Input Error" });
    }

    // Hashing Password
    const password = crypto.createHash('sha256').update(plainTextPassword).digest('hex');
    let imageId, imageName;
    if (request.file) {
        console.log('request file image----------------------', request.file)
        imageId = request.file.filename;
        imageName = request.file.originalname;
        console.log('imageId-------------', imageId)
        console.log('imageName-------------', imageName)
    }

    try {
        const person = await Person.create({
            name,
            email,
            password,
            username,
            imageId,
            imageName,
            otp: generateOTP()
        })
        console.log("Person Data----------------", person)

        return response.status(200).send({ status: true, message: "Registration Successful" });
    } catch (error) {
        if (error.code === 11000) {
            return response.status(400).send({ status: false, message: "Email already in use" });
        }
        console.log('Error---------------------------', error)
        return response.status(400).send({ status: false, message: "Error in Registration" });
    }
}

//----------------------- Login -----------------------
const login = async (request, response) => {
    try {
        const { email, password } = request.body

        console.log("Login request body----------", request.body)
        const person = await Person.findOne({ email })

        const passwordHash = crypto.createHash('sha256').update(password).digest('hex');
        if (!person) {
            return response.status(400).send({ status: false, message: "User NOT Found" });
        }
        else if (passwordHash == person.password) {
            const accessToken = generateAccessToken(person._id, person.email)
            // const refreshToken = generateRefreshToken(person._id, person.email)
            return response.status(200).send({ status: true, accessToken: accessToken, personEmail: person.email })
        }
        else {
            return response.status(400).send({ status: false, message: "Invalid Password" });
        }
    } catch (error) {
        console.log('Error---------------------------', error)
        return response.status(400).send({ status: false, message: "Error in Login" });
    }
}

//----------------------- new Access Token -----------------------
// const newAccessToken = async (request, response) => {
//     try {
//         const refreshToken = request.body.token;
//         if (refreshToken == null) {
//             return response.status(400).send({ status: false, message: "NO Refresh Token Found" });
//         }
//         if (!refreshTokens.includes(refreshToken))
//             return response.status(400).send({ status: false, message: "Invalid Refresh Token!!! Token NOT Found" });

//         jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (error, user) => {
//             if (error) {
//                 return response.status(400).send({ status: false, message: "Invalid Refresh Token!!!" });
//             }
//             const user = request.user;
//             const accessToken = generateAccessToken(request.user.id, request.user.email)
//             return response.status(200).send({ status: true, accessToken: accessToken, userEmail: user.email })
//         })
//     } catch (error) {
//         console.log("Error in generating New Access Token------------------", error);
//         return response.status(400).send({ status: false, message: "Error!!! In generating New Access Token" });
//     }
// }


//----------------------- Update Person -----------------------
const updatePerson = async (request, response) => {
    try {
        const { name, username, password: plainTextPassword } = request.body;
        // console.log("update request---------------------", request);
        console.log("update request body---------------------", request.body);
        const person = request.user;
        console.log("person---------------------", person);

        if (person) {
            if (!name || !username || !plainTextPassword || typeof name !== 'string' || typeof username !== 'string' || typeof plainTextPassword !== 'string') {
                return response.status(400).send({ status: false, message: "User Input Error" });
            }
            const password = crypto.createHash('sha256').update(plainTextPassword).digest('hex');

            let imageId, imageName;
            if (request.file) {
                console.log('request file image----------------------', request.file)
                imageId = request.file.filename;
                imageName = request.file.originalname;
            }
            const personData = await Person.findByIdAndUpdate({ _id: person.id }, {
                $set: {
                    name,
                    password,
                    username,
                    imageId,
                    imageName,
                }
            })

            console.log("Person Data----------------", personData)
            return response.status(200).send({ status: true, message: "Updation Successful" });
        }
        else {
            return response.status(400).send({ status: false, message: "Person NOT Found" });
        }
    } catch (error) {
        console.log('Error Login---------------------------', error)
        return response.status(400).send({ status: false, message: "Error in Login" });
    }
}

//----------------------- Get Person -----------------------
const getPerson = async (request, response) => {
    try {
        console.log('Get Person Request Id-----------------', request.user.id);
        const personData = await Person.findById({ _id: request.user.id });

        if (!personData) {
            return response.status(400).send({ status: false, message: "User NOT Found" });
        }
        else {
            console.log('Person--------------------', personData);
            return response.status(200).send({ status: true, message: 'Get Post Successful', data: personData });
        }
    } catch (error) {
        console.error('Error!!!---------------:', error);
        return response.status(400).send({ status: false, message: "Error in Get Person Data" });
    }
}

//----------------------- Delete Person -----------------------
const deletePerson = async (request, response) => {
    try {
        console.log('delete person params-------------------', request.params.id);
        const personId = request.params.id;
        const person = await Person.findById({ _id: personId });
        if (!person) {
            return response.status(400).send({ status: false, message: 'User NOT Found' });
        }
        else {
            await Post.deleteMany({ person: personId });
            await Person.deleteOne({ _id: personId });

            return response.status(200).send({ status: true, message: 'User Deleted Successfully' });
        }
    } catch (error) {
        console.error('Error!!!---------------', error);
        return response.status(400).send({ status: false, message: "Error in Deleting Person Data" });
    }
}

//----------------------- Save/Unsave Post -----------------------
const savingPost = async (request, response) => {
    try {
        console.log('like post params-------------------', request.params.postId);
        const postId = request.params.postId;
        const person = await Person.findById({ _id: request.user.id });
        const post = await Post.findById({ _id: postId });
        if (!person) {
            return response.status(400).send({ status: false, message: 'User NOT Found' });
        }
        else if (!post) {
            return response.status(400).send({ status: false, message: 'Post NOT Found' });
        }
        else {
            let saveArray = person.saved;
            const indexPost = saveArray.indexOf(post._id);
            if (indexPost >= 0) {
                console.log('index-----------------', indexPost);

                const x = saveArray.splice(indexPost, 1);
                person.saved = saveArray;

                await person.save();
                return response.status(200).send({ status: true, message: 'Post Unsaved Successfully' });
            }
            else {
                person.saved.push(post._id);
                await person.save();
                return response.status(200).send({ status: true, message: 'Post Saved Successfully' });
            }
        }
    } catch (error) {
        console.error('Error!!!---------------', error);
        return response.status(400).send({ status: false, message: "Error in Saving Post" });
    }
}

module.exports = {
    registration,
    login,
    updatePerson,
    getPerson,
    deletePerson,
    savingPost
}
