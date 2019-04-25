const express = require("express");
const validation = require("./validation");
const router = express.Router();


const userController = require("../controllers/userController");

router.get("/users/signup", userController.signup);
router.post("/users", validation.validateUser, userController.create);
router.get("/users/signin", userController.signinForm);
router.post("/users/signin", validation.validateUser, userController.signin);
router.get("/users/signout", userController.signOut);

module.exports = router;