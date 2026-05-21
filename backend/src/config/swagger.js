const healthSwagger = require("../docs/health.swagger");
const sessionsSwagger = require("../docs/sessions.swagger");

const swaggerSpec = {
  openapi: "3.0.0",
  info: {
    title: "FitBook API",
    version: "1.0.0",
    description: "API documentation for the FitBook booking application",
  },
  servers: [
    {
      url: "http://localhost:3000",
      description: "Local development server",
    },
  ],
  tags: [
    {
      name: "Health",
      description: "API health checks",
    },
    {
      name: "Sessions",
      description: "Training sessions",
    },
  ],
  paths: {
    ...healthSwagger.paths,
    ...sessionsSwagger.paths,
  },
  components: {
    schemas: {
      ...healthSwagger.schemas,
      ...sessionsSwagger.schemas,
    },
  },
};

module.exports = swaggerSpec;