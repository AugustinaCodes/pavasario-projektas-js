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
                      example: 10,
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
        session_type: {
          type: "string",
          enum: ["individual", "group"],
          example: "individual",
        },
        capacity: {
          type: "integer",
          minimum: 1,
          example: 1,
        },
        slots: {
          type: "array",
          description:
            "Scheduled times for group sessions. Individual sessions return an empty array.",
          items: {
            $ref: "#/components/schemas/SessionSlot",
          },
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

    SessionSlot: {
      type: "object",
      properties: {
        id: {
          type: "integer",
          example: 7,
        },
        session_date: {
          type: "string",
          format: "date",
          example: "2026-06-09",
        },
        start_time: {
          type: "string",
          example: "18:30:00",
        },
        available_places: {
          type: "integer",
          minimum: 0,
          example: 15,
        },
      },
    },
  },
};

module.exports = sessionsSwagger;
