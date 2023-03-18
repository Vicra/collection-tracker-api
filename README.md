## Biolerplate

https://github.com/hueter/docker-node-express-boilerplate

Node version used: 16.18.1

## How to Install & Run

1.  Run `docker-compose up` to start three containers:
    - Mongo container
    - Node.js app container
    - NGINX proxy container
1.  Server is accessible at `http://localhost:8080`

## Production environment

GET https://collectiontrackerapi.lat/collectives

## Swagger documentation

https://collectiontrackerapi.lat/api-docs/

## How to Run Tests

Use LTS version of Node
`npm install` followed by `npm test` to run everything

## About the project

**./app**

- `handlers` are Express.js route handlers that have `request`, `response`, and `next` parameters.
- `helpers` are raw JS "classes" and utility functions for use across the app
- `models` are [Mongoose schema](https://mongoosejs.com/docs/guide.html) definitions and associated models
- `routers` are RESTful route declarations using [express.Router module](https://expressjs.com/en/guide/routing.html) that utilize the functions in `handlers`
- `dtos` are [JSONSchema](https://json-schema.org/understanding-json-schema/index.html) validation schemas for creating or updating an Entity.
- `app.js` is what builds and configures the express app
- `config.js` is the app-specific config that you will want to customize for your app
- `index.js` is the entrypoint that actually starts the Express server

**./config**

- config contains NGINX proxy configuration, the production pm2 configuration (the process-runner of choice), and the Jest configuration to run MongoDB in memory
