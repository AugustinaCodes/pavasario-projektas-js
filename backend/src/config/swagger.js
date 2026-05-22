const healthSwagger = require("../docs/health.swagger");
const sessionsSwagger = require("../docs/sessions.swagger");
const authSwagger = require("../docs/auth.swagger");

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
    {
      name: "Auth",
      description: "Authentication endpoints",
    },
  ],
  paths: {
    ...healthSwagger.paths,
    ...sessionsSwagger.paths,
    ...authSwagger.paths,
  },
  components: {
    securitySchemes: {
      cookieAuth: {
        type: "apiKey",
        in: "cookie",
        name: "jwt",
      },
    },
    schemas: {
      ...healthSwagger.schemas,
      ...sessionsSwagger.schemas,
      ...authSwagger.schemas,
    },
  },
};

module.exports = swaggerSpec;
