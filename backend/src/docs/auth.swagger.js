const authSwagger = {
  paths: {
    "/api/auth/register": {
      post: {
        summary: "Register a new user",
        tags: ["Auth"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/RegisterRequest",
              },
            },
          },
        },
        responses: {
          201: {
            description: "User registered successfully",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/AuthUserResponse",
                },
              },
            },
          },
          400: {
            description: "Validation failed",
          },
          409: {
            description: "Email already exists",
          },
        },
      },
    },

    "/api/auth/login": {
      post: {
        summary: "Log in user",
        tags: ["Auth"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/LoginRequest",
              },
            },
          },
        },
        responses: {
          200: {
            description: "User logged in successfully",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/AuthUserResponse",
                },
              },
            },
          },
          400: {
            description: "Validation failed",
          },
          401: {
            description: "Invalid email or password",
          },
        },
      },
    },

    "/api/auth/logout": {
      post: {
        summary: "Log out user",
        tags: ["Auth"],
        responses: {
          200: {
            description: "User logged out successfully",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/LogoutResponse",
                },
              },
            },
          },
        },
      },
    },

    "/api/auth/me": {
      get: {
        summary: "Get current authenticated user",
        tags: ["Auth"],
        security: [
          {
            cookieAuth: [],
          },
        ],
        responses: {
          200: {
            description: "Current user data",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/AuthMeResponse",
                },
              },
            },
          },
          401: {
            description: "User is not authenticated",
          },
        },
      },

      patch: {
        summary: "Update current authenticated user",
        tags: ["Auth"],
        security: [
          {
            cookieAuth: [],
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/UpdateProfileRequest",
              },
            },
          },
        },
        responses: {
          200: {
            description: "Current user updated successfully",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/AuthMeResponse",
                },
              },
            },
          },
          400: {
            description: "Validation failed",
          },
          401: {
            description: "Current password is incorrect",
          },
          409: {
            description: "Email already exists",
          },
        },
      },

      delete: {
        summary: "Delete current authenticated user",
        tags: ["Auth"],
        security: [
          {
            cookieAuth: [],
          },
        ],
        responses: {
          200: {
            description: "Current user deleted successfully",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/DeleteAccountResponse",
                },
              },
            },
          },
          401: {
            description: "User is not authenticated",
          },
        },
      },
    },
  },

  schemas: {
    RegisterRequest: {
      type: "object",
      required: ["name", "email", "password"],
      properties: {
        name: {
          type: "string",
          example: "Lina User",
        },
        email: {
          type: "string",
          format: "email",
          example: "lina@example.com",
        },
        password: {
          type: "string",
          format: "password",
          example: "Password123!",
        },
      },
    },

    LoginRequest: {
      type: "object",
      required: ["email", "password"],
      properties: {
        email: {
          type: "string",
          format: "email",
          example: "john.smith@example.com",
        },
        password: {
          type: "string",
          format: "password",
          example: "Password123!",
        },
      },
    },

    User: {
      type: "object",
      properties: {
        id: {
          type: "integer",
          example: 1,
        },
        name: {
          type: "string",
          example: "John Smith",
        },
        email: {
          type: "string",
          format: "email",
          example: "john.smith@example.com",
        },
        role: {
          type: "string",
          example: "user",
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

    AuthUserResponse: {
      type: "object",
      properties: {
        status: {
          type: "string",
          example: "success",
        },
        data: {
          type: "object",
          properties: {
            user: {
              $ref: "#/components/schemas/User",
            },
          },
        },
      },
    },

    AuthMeResponse: {
      type: "object",
      properties: {
        status: {
          type: "string",
          example: "success",
        },
        data: {
          type: "object",
          properties: {
            user: {
              $ref: "#/components/schemas/User",
            },
          },
        },
      },
    },

    UpdateProfileRequest: {
      type: "object",
      properties: {
        name: {
          type: "string",
          example: "Lina User",
        },
        email: {
          type: "string",
          format: "email",
          example: "lina@example.com",
        },
        currentPassword: {
          type: "string",
          format: "password",
          example: "Password123!",
        },
        password: {
          type: "string",
          format: "password",
          example: "NewPassword123!",
        },
      },
    },

    DeleteAccountResponse: {
      type: "object",
      properties: {
        status: {
          type: "string",
          example: "success",
        },
        message: {
          type: "string",
          example: "Your account has been deleted",
        },
      },
    },

    LogoutResponse: {
      type: "object",
      properties: {
        status: {
          type: "string",
          example: "success",
        },
        message: {
          type: "string",
          example: "Logged out successfully",
        },
      },
    },
  },
};

module.exports = authSwagger;