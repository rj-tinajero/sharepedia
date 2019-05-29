const express = require("express");
const router = express.Router();
const collaboratorController = require("../controllers/collaboratorController");

router.post("/wikis/:id/collaborators/create", 
   collaboratorController.create);
router.post("/wikis/:wikiId/collaborators/:id/destroy", 
   collaboratorController.destroy);

module.exports = router;

// read up on closures
// read up on callbacks

// read these a lot then talk to james