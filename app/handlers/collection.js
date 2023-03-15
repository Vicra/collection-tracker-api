const { validate } = require("jsonschema");
const { Collection } = require("../models");
const { APIError } = require("../helpers");
const { collectionDTO } = require("../dtos");

async function createCollection(request, response, next) {
  const validation = validate(request.body, collectionDTO);
  if (!validation.valid) {
    return next(
      new APIError(
        400,
        "Bad Request",
        validation.errors.map((e) => e.stack).join(". ")
      )
    );
  }

  try {
    const newCollection = await Collection.createCollection(
      new Collection(request.body)
    );
    return response.status(201).json(newCollection);
  } catch (err) {
    return next(err);
  }
}

/**
 * Get a single collection
 * @param {String} name - the name of the Collection to retrieve
 */
async function getCollection(request, response, next) {
  const { name } = request.params;
  try {
    const collection = await Collection.getCollection(name);
    return response.json(collection);
  } catch (err) {
    return next(err);
  }
}

/**
 * Update a single collection
 * @param {String} name - the name of the Collection to update
 */
async function updateCollection(request, response, next) {
  const { name } = request.params;

  const validation = validate(request.body, collectionDTO);
  if (!validation.valid) {
    return next(
      new APIError(
        400,
        "Bad Request",
        validation.errors.map((e) => e.stack).join(". ")
      )
    );
  }

  try {
    const collection = await Collection.updateCollection(name, request.body);
    return response.json(collection);
  } catch (err) {
    return next(err);
  }
}

/**
 * Remove a single collection
 * @param {String} name - the name of the Collection to remove
 */
async function deleteCollection(request, response, next) {
  const { name } = request.params;
  try {
    const deleteMsg = await Collection.deleteCollection(name);
    return response.json(deleteMsg);
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  createCollection,
  getCollection,
  updateCollection,
  deleteCollection,
};
