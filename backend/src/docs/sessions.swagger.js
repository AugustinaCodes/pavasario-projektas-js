const sessionsSwagger = {
  paths: {
    "/api/sessions": {
      get: {
        summary: "Get all training sessions",
        tags: ["Sessions"],
        responses: {
          200: {
            description: "List of training sessions",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: {
                      type: "string",
                      example: "success",
                    },
                    results: {
                      type: "integer",
                      example: 5,
                    },
                    data: {
                      type: "array",
                      items: {
                        $ref: "#/components/schemas/Session",
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

    "/api/sessions/{id}": {
      get: {
        summary: "Get a training session by ID",
        tags: ["Sessions"],
        parameters: [
          {
            in: "path",
            name: "id",
            required: true,
            schema: {
              type: "integer",
            },
            description: "Training session ID",
          },
        ],
        responses: {
          200: {
            description: "Training session details",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: {
                      type: "string",
                      example: "success",
                    },
                    data: {
                      $ref: "#/components/schemas/Session",
                    },
                  },
                },
              },
            },
          },
          404: {
            description: "Session not found",
          },
          400: {
            description: "Session ID must be a positive integer",
          },
        },
      },
    },
  },

  schemas: {
    Session: {
      type: "object",
      properties: {
        id: {
          type: "integer",
          example: 1,
        },
        title: {
          type: "string",
          example: "Personal Training",
        },
        description: {
          type: "string",
          example:
            "One-on-one training session with a personal coach focused on individual goals, technique and progress.",
        },
        duration_minutes: {
          type: "integer",
          example: 60,
        },
        price: {
          type: "string",
          example: "40.00",
        },
        created_at: {
          type: "string",
          format: "date-time",
        },
        updated_at: {
          type: "string",
          format: "date-time",
        },
      },
    },
  },
};

module.exports = sessionsSwagger;
