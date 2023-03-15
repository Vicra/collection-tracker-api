// npm packages
const express = require("express");

// app imports
const { collectiveHandler, collectivesHandler } = require("../handlers");

// globals
const router = new express.Router();
const { getCollectives } = collectivesHandler;
const {
  createCollective,
  getCollective,
  updateCollective,
  deleteCollective,
  getGroups,
} = collectiveHandler;

/* All the Collectives Route */
router.route("").get(getCollectives).post(createCollective);

router.route("/groups").get(getGroups);

/* Single Collective by Name Route */
router
  .route("/:name")
  .get(getCollective)
  .patch(updateCollective)
  .delete(deleteCollective);

module.exports = router;
