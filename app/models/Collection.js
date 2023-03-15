// npm packages
const mongoose = require("mongoose");

// app imports
const { APIError } = require("../helpers");

// globals
const Schema = mongoose.Schema;

let cacheFix = 1000;

const collectionSchema = new Schema({
  name: String,
  value: Number,
  year: String,
  condition: String,
  location: String,
  group: String,
});

collectionSchema.statics = {
  /**
   * Create a Single New Collection
   * @param {object} newCollection - an instance of Collection
   * @returns {Promise<Collection, APIError>}
   */
  async createCollection(newCollection) {
    const duplicate = await this.findOne({ name: newCollection.name });
    if (duplicate) {
      throw new APIError(
        409,
        "Collection Already Exists",
        `There is already a collection with name '${newCollection.name}'.`
      );
    }
    const collection = await newCollection.save();
    return collection.toObject();
  },
  /**
   * Delete a single Collection
   * @param {String} name - the Collection's name
   * @returns {Promise<Collection, APIError>}
   */
  async deleteCollection(name) {
    const deleted = await this.findOneAndRemove({ name });
    if (!deleted) {
      throw new APIError(
        404,
        "Collection Not Found",
        `No collection '${name}' found.`
      );
    }
    return deleted.toObject();
  },
  /**
   * Get a single Collection by name
   * @param {String} name - the Collection's name
   * @returns {Promise<Collection, APIError>}
   */
  async getCollection(name) {
    const collection = await this.findOne({ name });

    if (!collection) {
      throw new APIError(
        404,
        "Collection Not Found",
        `No collection '${name}' found.`
      );
    }
    return collection.toObject();
  },
  /**
   * Get a list of Collections
   * @param {Object} query - pre-formatted query to retrieve collections.
   * @param {Object} fields - a list of fields to select or not in object form
   * @param {String} skip - number of docs to skip (for pagination)
   * @param {String} limit - number of docs to limit by (for pagination)
   * @returns {Promise<Collections, APIError>}
   */
  async getCollections(query, fields, skip, limit) {
    const collections = await this.find(query, fields)
      .limit(limit || cacheFix++)
      .skip(skip)
      .sort({ name: 1 })
      .exec();

    if (!collections.length) {
      return [];
    }
    return collections.map((collection) => collection.toObject());
  },
  /**
   * Get a list of groups
   * @returns {Promise<Collections, APIError>}
   */
  async getGroups() {
    const collections = await this.aggregate()
      .sortByCount("group")
      .sort({ group: 1 })
      .exec();

    if (!collections.length) {
      return [];
    }
    return collections.map((collection) => collection);
  },
  /**
   * Patch/Update a single Collection
   * @param {String} name - the Collection's name
   * @param {Object} collectionUpdate - the json containing the Collection attributes
   * @returns {Promise<Collection, APIError>}
   */
  async updateCollection(name, collectionUpdate) {
    const collection = await this.findOneAndUpdate({ name }, collectionUpdate, {
      new: true,
    });
    if (!collection) {
      throw new APIError(
        404,
        "Collection Not Found",
        `No collection '${name}' found.`
      );
    }
    return collection.toObject();
  },
};

/* Transform with .toObject to remove __v and _id from response */
if (!collectionSchema.options.toObject) collectionSchema.options.toObject = {};
collectionSchema.options.toObject.transform = (_, ret) => {
  const transformed = ret;
  delete transformed._id;
  delete transformed.__v;
  return transformed;
};

/** Ensure MongoDB Indices **/
collectionSchema.index({ name: 1, number: 1 }, { unique: true }); // example compound idx

module.exports = mongoose.model("Collection", collectionSchema);
