const express = require("express");
const validation = require("./validation");
const router = express.Router();


const userController = require("../controllers/userController");

router.get("/users", userController.index);
router.get("/users/signup", userController.signup);
router.post("/users", validation.validateUser, userController.create);
router.get("/users/signin", userController.signinForm);
router.post("/users/signin", validation.validateUser, userController.signin);
router.get("/users/signout", userController.signOut);
router.get("/users/charge", userController.chargeForm);
router.post("/users/charge", userController.charge);
router.get("/users/downGrade", userController.downGrade);

module.exports = router;