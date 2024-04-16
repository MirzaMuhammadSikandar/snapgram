const postRouter = require('express').Router();
const {authenticateToken, isLoggedIn} = require('../middlewares/auth.js');
const {addPost, updatePost, deletePost, getPost, likePost} = require('../controllers/postController.js')

postRouter.post('/add', authenticateToken, isLoggedIn, addPost);
// postRouter.put('/update/:id', authenticateToken, isLoggedIn, updatePost);
postRouter.delete('/delete/:id', authenticateToken, isLoggedIn, deletePost);
postRouter.get('/record/:id', authenticateToken, isLoggedIn, getPost);
postRouter.post('/like/:id', authenticateToken, isLoggedIn, likePost);


module.exports = postRouter;