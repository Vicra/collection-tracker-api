// npm packages
const mongoose = require("mongoose");

// app imports
const { APIError } = require("../helpers");

// globals
const Schema = mongoose.Schema;

let cacheFix = 1000;

const collectiveSchema = new Schema({
  name: { type: String, required: true },
  value: Number,
  year: String,
  condition: String,
  location: String,
  group: String,
});

collectiveSchema.statics = {
  /**
   * Create a Single New Collective
   * @param {object} newCollective - an instance of Collective
   * @returns {Promise<Collective, APIError>}
   */
  async createCollective(newCollective) {
    const duplicate = await this.findOne({ name: newCollective.name });
    if (duplicate) {
      throw new APIError(
        409,
        "Collective Already Exists",
        `There is already a collective with name '${newCollective.name}'.`
      );
    }
    const collective = await newCollective.save();
    return collective.toObject();
  },
  /**
   * Delete a single Collective
   * @param {String} name - the Collective's name
   * @returns {Promise<Collective, APIError>}
   */
  async deleteCollective(name) {
    const deleted = await this.findOneAndRemove({ name });
    if (!deleted) {
      throw new APIError(
        404,
        "Collective Not Found",
        `No collective '${name}' found.`
      );
    }
    return deleted.toObject();
  },
  /**
   * Get a single Collective by name
   * @param {String} name - the Collective's name
   * @returns {Promise<Collective, APIError>}
   */
  async getCollective(name) {
    const collective = await this.findOne({ name });

    if (!collective) {
      throw new APIError(
        404,
        "Collective Not Found",
        `No collective '${name}' found.`
      );
    }
    return collective.toObject();
  },
  /**
   * Get a list of Collectives
   * @param {Object} query - pre-formatted query to retrieve collectives.
   * @param {Object} fields - a list of fields to select or not in object form
   * @param {String} skip - number of docs to skip (for pagination)
   * @param {String} limit - number of docs to limit by (for pagination)
   * @returns {Promise<Collectives, APIError>}
   */
  async getCollectives(query, fields, skip, limit) {
    const collectives = await this.find(query, fields)
      .limit(limit || cacheFix++)
      .skip(skip)
      .sort({ name: 1 })
      .exec();

    if (!collectives.length) {
      return [];
    }
    return collectives.map((collective) => collective.toObject());
  },
  /**
   * Get a list of groups
   * @returns {Promise<Collectives, APIError>}
   */
  async getGroups() {
    const collectives = await this.aggregate()
      .sortByCount("group")
      .sort({ group: 1 })
      .exec();

    if (!collectives.length) {
      return [];
    }
    return collectives.map((collective) => collective);
  },
  /**
   * Patch/Update a single Collective
   * @param {String} name - the Collective's name
   * @param {Object} collectiveUpdate - the json containing the Collective attributes
   * @returns {Promise<Collective, APIError>}
   */
  async updateCollective(name, collectiveUpdate) {
    const collective = await this.findOneAndUpdate({ name }, collectiveUpdate, {
      new: true,
    });
    if (!collective) {
      throw new APIError(
        404,
        "Collective Not Found",
        `No collective '${name}' found.`
      );
    }
    return collective.toObject();
  },
};

/* Transform with .toObject to remove __v and _id from response */
if (!collectiveSchema.options.toObject) collectiveSchema.options.toObject = {};
collectiveSchema.options.toObject.transform = (_, ret) => {
  const transformed = ret;
  delete transformed._id;
  delete transformed.__v;
  return transformed;
};

/** Ensure MongoDB Indices **/
collectiveSchema.index({ name: 1, number: 1 }, { unique: true }); // example compound idx

module.exports = mongoose.model("Collective", collectiveSchema);
