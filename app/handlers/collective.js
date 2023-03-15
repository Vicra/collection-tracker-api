const { validate } = require("jsonschema");
const { Collective } = require("../models");
const { APIError } = require("../helpers");
const { collectiveDTO } = require("../dtos");

async function createCollective(request, response, next) {
  const validation = validate(request.body, collectiveDTO);
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
    const newCollective = await Collective.createCollective(
      new Collective(request.body)
    );
    return response.status(201).json(newCollective);
  } catch (err) {
    return next(err);
  }
}

/**
 * Get a single collective
 * @param {String} name - the name of the Collective to retrieve
 */
async function getCollective(request, response, next) {
  const { name } = request.params;
  try {
    const collective = await Collective.getCollective(name);
    return response.json(collective);
  } catch (err) {
    return next(err);
  }
}

/**
 * Update a single collective
 * @param {String} name - the name of the Collective to update
 */
async function updateCollective(request, response, next) {
  const { name } = request.params;

  const validation = validate(request.body, collectiveDTO);
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
    const collective = await Collective.updateCollective(name, request.body);
    return response.json(collective);
  } catch (err) {
    return next(err);
  }
}

/**
 * Remove a single collective
 * @param {String} name - the name of the Collective to remove
 */
async function deleteCollective(request, response, next) {
  const { name } = request.params;
  try {
    const deleteMsg = await Collective.deleteCollective(name);
    return response.json(deleteMsg);
  } catch (err) {
    return next(err);
  }
}

/**
 * Get the list of groups
 */
async function getGroups(_, response, next) {
  try {
    const groups = await Collective.getGroups();
    return response.json(groups);
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  createCollective,
  getCollective,
  updateCollective,
  deleteCollective,
  getGroups,
};
