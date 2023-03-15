// npm packages
const dotenv = require("dotenv");
const express = require("express");
const swaggerUi = require("swagger-ui-express");

const fs = require("fs");
const YAML = require("yaml");

const file = fs.readFileSync("./swagger.yaml", "utf8");
const swaggerDocument = YAML.parse(file);

// app imports
const { connectToDatabase, globalResponseHeaders } = require("./config");
const { errorHandler } = require("./handlers");
const { collectiveRouter } = require("./routers");

// global constants
dotenv.config();
const app = express();
const {
  bodyParserHandler,
  globalErrorHandler,
  fourOhFourHandler,
  fourOhFiveHandler,
} = errorHandler;

// database
connectToDatabase();

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// body parser setup
app.use(express.urlencoded({ extended: true }));
app.use(express.json({ type: "*/*" }));
app.use(bodyParserHandler); // error handling specific to body parser only

// response headers setup; CORS
app.use(globalResponseHeaders);

app.use("/collectives", collectiveRouter);

// catch-all for 404 "Not Found" errors
app.get("*", fourOhFourHandler);
// catch-all for 405 "Method Not Allowed" errors
app.all("*", fourOhFiveHandler);

app.use(globalErrorHandler);

/**
 * This file does NOT run the app. It merely builds and configures it then exports it.config
 *  This is for integration tests with supertest (see __tests__).
 */
module.exports = app;
