/**
 * These tests currently only work if you have a local MongoDB database
 */
const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../app/app");
const { Collective } = require("../app/models");

const collectiveMock = {
  name: "ancientEgyptPlate",
  value: 1000,
  year: "3000 BC",
  condition: "used",
  location: "Egypt",
  group: "relic",
};

beforeEach(async () => {
  const collectiveObj = new Collective(collectiveMock);
  const a = await collectiveObj.save();
});

afterEach(async () => {
  await mongoose.connection.dropCollection("collectives");
});

afterAll(async () => {
  await mongoose.disconnect();
});

describe("GET /collectives", () => {
  test("Get a list of collectives", async () => {
    let response = await request(app).get("/collectives");
    expect(response.body).toEqual([collectiveMock]);
  });
});

describe("POST /collectives", () => {
  test("Create a new item", async () => {
    let response = await request(app)
      .post("/collectives")
      .send({ name: "ball", group: "default", value: 10 });
    expect(response.body).toEqual({
      name: "ball",
      group: "default",
      value: 10,
    });
  });
  test("Create a full new item", async () => {
    const fullItem = {
      name: "full ball",
      value: 1000,
      year: "2023",
      condition: "new",
      location: "USA",
      group: "fun",
    };
    let response = await request(app).post("/collectives").send(fullItem);
    expect(response.body).toEqual(fullItem);

    let duplicateResponse = await request(app)
      .post("/collectives")
      .send({ name: "full ball" });
    expect(duplicateResponse.status).toEqual(400);
  });
});

describe("PATCH /collectives/:name", () => {
  test("Update a collectives's name", async () => {
    let response = await request(app)
      .patch("/collectives/ancientEgyptPlate")
      .send({ name: "ancientPlate", group: "relic", value: 1000 });
    expect(response.body).toEqual({
      ...collectiveMock,
      name: "ancientPlate",
    });
  });
});

describe("DELETE /things/:name", () => {
  test("Delete a collective name", async () => {
    let response = await request(app).delete("/collectives/ancientEgyptPlate");
    expect(response.body).toEqual(collectiveMock);
  });
});
