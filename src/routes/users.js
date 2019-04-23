const express = require("express");
const router = express.Router();


const userController = require("../controllers/userController");

router.get("/users/signup", userController.signup);
router.post("/users", userController.create);

module.exports = router;