const personRouter = require('express').Router();
const { authenticateToken, isLoggedIn } = require('../middlewares/auth.js')
const upload = require('../middlewares/multer.js')
const { registration, login, updatePerson, getPerson, deletePerson, savingPost} = require('../controllers/personController.js')
// const {getGoogleURL, googleCallback} = require('../controllers/googleController.js')


personRouter.post('/register', upload.single('image'), registration);
personRouter.post('/login', login);
// personRouter.post('/token', newAccessToken);
personRouter.put('/update', authenticateToken, isLoggedIn, upload.single('image'), updatePerson);
personRouter.get('/record', authenticateToken, isLoggedIn, getPerson);
personRouter.delete('/delete/:id', deletePerson);
personRouter.post('/save-post/:postId', authenticateToken, isLoggedIn, savingPost);
// personRouter.get('/googleurl', getGoogleURL);
// Note: If callback NOT in google credentials then app access blocked
// personRouter.get('/google/callback', googleCallback);

module.exports = personRouter;