const healthSwagger = {
  paths: {
    "/api/health": {
      get: {
        summary: "Check API and database health",
        tags: ["Health"],
        responses: {
          200: {
            description: "API and database are running",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: {
                      type: "string",
                      example: "success",
                    },
                    message: {
                      type: "string",
                      example: "FitBook API is running",
                    },
                    database: {
                      type: "string",
                      example: "connected",
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  },

  schemas: {},
};

module.exports = healthSwagger;