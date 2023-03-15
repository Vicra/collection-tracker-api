// npm packages
const express = require("express");

// app imports
const { collectionHandler, collectionsHandler } = require("../handlers");

// globals
const router = new express.Router();
const { getCollections } = collectionsHandler;
const { createCollection, getCollection, updateCollection, deleteCollection } =
  collectionHandler;

/* All the Collections Route */
router.route("").get(getCollections).post(createCollection);

/* Single Collection by Name Route */
router
  .route("/:name")
  .get(getCollection)
  .patch(updateCollection)
  .delete(deleteCollection);

module.exports = router;
