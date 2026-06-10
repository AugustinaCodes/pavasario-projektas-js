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

      post: {
        summary: "Create a training session",
        tags: ["Sessions"],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/SessionInput",
              },
            },
          },
        },
        responses: {
          201: {
            description: "Session created successfully",
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
                      type: "object",
                      properties: {
                        session: {
                          $ref: "#/components/schemas/Session",
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          400: { description: "Validation error" },
          401: { description: "Unauthorized" },
          403: { description: "Admin access required" },
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
            schema: { type: "integer" },
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
                    status: { type: "string", example: "success" },
                    data: {
                      $ref: "#/components/schemas/Session",
                    },
                  },
                },
              },
            },
          },
          404: { description: "Session not found" },
          400: { description: "Session ID must be a positive integer" },
        },
      },

      patch: {
        summary: "Update a training session",
        tags: ["Sessions"],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: "path",
            name: "id",
            required: true,
            schema: { type: "integer" },
            description: "Training session ID",
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/SessionInput",
              },
            },
          },
        },
        responses: {
          200: {
            description: "Session updated successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "string", example: "success" },
                    data: {
                      type: "object",
                      properties: {
                        session: {
                          $ref: "#/components/schemas/Session",
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          400: { description: "Validation error" },
          401: { description: "Unauthorized" },
          403: { description: "Admin access required" },
          404: { description: "Session not found" },
        },
      },

      delete: {
        summary: "Delete a training session",
        tags: ["Sessions"],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: "path",
            name: "id",
            required: true,
            schema: { type: "integer" },
            description: "Training session ID",
          },
        ],
        responses: {
          200: {
            description: "Session deleted successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "string", example: "success" },
                    data: {
                      type: "object",
                      properties: {
                        session: {
                          $ref: "#/components/schemas/Session",
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          400: { description: "Session ID must be a positive integer" },
          401: { description: "Unauthorized" },
          403: { description: "Admin access required" },
          404: { description: "Session not found" },
        },
      },
    },
  },

  schemas: {
    SessionInput: {
      type: "object",
      required: [
        "title",
        "description",
        "price",
        "duration_minutes",
        "session_type",
        "capacity",
      ],
      properties: {
        title: { type: "string", example: "Personal Training" },
        description: {
          type: "string",
          example: "One-on-one training session...",
        },
        price: { type: "number", example: 40 },
        duration_minutes: { type: "integer", example: 60 },
        session_type: {
          type: "string",
          enum: ["individual", "group"],
          example: "individual",
        },
        capacity: { type: "integer", example: 1 },
      },
    },

    Session: {
      type: "object",
      properties: {
        id: { type: "integer", example: 1 },
        title: { type: "string", example: "Personal Training" },
        description: { type: "string" },
        duration_minutes: { type: "integer", example: 60 },
        price: { type: "string", example: "40.00" },
        session_type: {
          type: "string",
          enum: ["individual", "group"],
        },
        capacity: { type: "integer", example: 1 },
        slots: {
          type: "array",
          items: {
            $ref: "#/components/schemas/SessionSlot",
          },
        },
        created_at: { type: "string", format: "date-time" },
        updated_at: { type: "string", format: "date-time" },
      },
    },

    SessionSlot: {
      type: "object",
      properties: {
        id: { type: "integer", example: 7 },
        session_date: { type: "string", format: "date" },
        start_time: { type: "string", example: "18:30:00" },
        available_places: { type: "integer", example: 15 },
      },
    },
  },
};

module.exports = sessionsSwagger;
