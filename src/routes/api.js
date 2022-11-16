const express = require("express");
const router = express.Router();
const authMiddleWare = require("../middleware/auth_middleware");
const authController = require("../controllers/auth_controller");
const storageController = require('../controllers/storage_controller')
const dataController = require('../controllers/data_controller');

/**
 * Init all APIs on your application
 * @param {*} app from express
 */
let initAPIs = (app) => {
router.post('/login', authController.login);
router.post('/signup', authController.signup);
router.post('/refresh-token', authController.refreshToken);
router.post('/registry', authController.registry)
router.get('/video', storageController.streamVideo)
router.post('/avatar', storageController.upload.single('avatar'), storageController.uploadAvatar)
router.post('/checkin', storageController.checkin.single('checkin'), storageController.checkinFun)

router.use(authMiddleWare.isAuth);
// List Protect APIs:
router.get('/user', authController.getUser)
router.post('/update-profile', authController.updateProfile)
router.get('/question', dataController.getQuestion)
router.get('/lessons', dataController.getLessons)
router.get('/test', dataController.getTest)
router.get('/result', dataController.getResult)
router.post('/submit_test', dataController.submitTest)
router.get('/test_infor', dataController.getTestInfor)




return app.use("/", router);
}

module.exports = initAPIs;