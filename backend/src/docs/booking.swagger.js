const bookingSwagger = {
  paths: {
    "/api/bookings/me": {
      get: {
        summary: "Get current user's bookings",
        tags: ["Bookings"],
        security: [
          {
            cookieAuth: [],
          },
        ],
        responses: {
          200: {
            description: "List of bookings for the authenticated user",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/BookingListResponse",
                },
              },
            },
          },
          401: {
            description: "User is not authenticated",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse",
                },
              },
            },
          },
        },
      },
    },

    "/api/bookings": {
      get: {
        summary: "Get all bookings",
        description: "Admin-only endpoint for viewing all user bookings.",
        tags: ["Bookings"],
        security: [
          {
            cookieAuth: [],
          },
        ],
        responses: {
          200: {
            description: "List of all bookings",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/AdminBookingListResponse",
                },
              },
            },
          },
          401: {
            description: "User is not authenticated",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse",
                },
              },
            },
          },
          403: {
            description: "User does not have admin permission",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse",
                },
              },
            },
          },
        },
      },

      post: {
        summary: "Create a booking",
        description:
          "Creates a booking for the authenticated user. Individual sessions require a date and time. Group sessions require a scheduled session slot.",
        tags: ["Bookings"],
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
                $ref: "#/components/schemas/CreateBookingRequest",
              },
            },
          },
        },
        responses: {
          201: {
            description: "Booking created successfully",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/BookingResponse",
                },
              },
            },
          },
          400: {
            description: "Validation failed",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse",
                },
              },
            },
          },
          401: {
            description: "User is not authenticated",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse",
                },
              },
            },
          },
          404: {
            description: "Session not found",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse",
                },
              },
            },
          },
          409: {
            description:
              "Booking already exists, the individual time is unavailable, or the group session is fully booked",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse",
                },
              },
            },
          },
        },
      },
    },

    "/api/bookings/{id}/confirm": {
      patch: {
        summary: "Confirm a booking",
        description:
          "Admin-only endpoint. Only pending bookings can be confirmed.",
        tags: ["Bookings"],
        security: [
          {
            cookieAuth: [],
          },
        ],
        parameters: [
          {
            in: "path",
            name: "id",
            required: true,
            schema: {
              type: "integer",
            },
            description: "Booking ID",
          },
        ],
        responses: {
          200: {
            description: "Booking confirmed successfully",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/AdminBookingResponse",
                },
              },
            },
          },
          400: {
            description: "Only pending bookings can be confirmed",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse",
                },
              },
            },
          },
          401: {
            description: "User is not authenticated",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse",
                },
              },
            },
          },
          403: {
            description: "User does not have admin permission",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse",
                },
              },
            },
          },
          404: {
            description: "Booking not found",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse",
                },
              },
            },
          },
          409: {
            description: "Booking status changed before the update completed",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse",
                },
              },
            },
          },
        },
      },
    },

    "/api/bookings/{id}/complete": {
      patch: {
        summary: "Complete a booking",
        description:
          "Admin-only endpoint. Only confirmed bookings can be completed.",
        tags: ["Bookings"],
        security: [
          {
            cookieAuth: [],
          },
        ],
        parameters: [
          {
            in: "path",
            name: "id",
            required: true,
            schema: {
              type: "integer",
            },
            description: "Booking ID",
          },
        ],
        responses: {
          200: {
            description: "Booking completed successfully",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/AdminBookingResponse",
                },
              },
            },
          },
          400: {
            description: "Only confirmed bookings can be completed",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse",
                },
              },
            },
          },
          401: {
            description: "User is not authenticated",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse",
                },
              },
            },
          },
          403: {
            description: "User does not have admin permission",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse",
                },
              },
            },
          },
          404: {
            description: "Booking not found",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse",
                },
              },
            },
          },
          409: {
            description: "Booking status changed before the update completed",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse",
                },
              },
            },
          },
        },
      },
    },

    "/api/bookings/{id}/cancel": {
      patch: {
        summary: "Cancel a booking",
        description:
          "Authenticated users can cancel their own bookings. Admin users can cancel any pending or confirmed booking.",
        tags: ["Bookings"],
        security: [
          {
            cookieAuth: [],
          },
        ],
        parameters: [
          {
            in: "path",
            name: "id",
            required: true,
            schema: {
              type: "integer",
            },
            description: "Booking ID",
          },
        ],
        responses: {
          200: {
            description: "Booking cancelled successfully",
            content: {
              "application/json": {
                schema: {
                  oneOf: [
                    {
                      $ref: "#/components/schemas/BookingResponse",
                    },
                    {
                      $ref: "#/components/schemas/AdminBookingResponse",
                    },
                  ],
                },
              },
            },
          },
          400: {
            description:
              "Booking is already cancelled or cannot be cancelled from current status",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse",
                },
              },
            },
          },
          401: {
            description: "User is not authenticated",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse",
                },
              },
            },
          },
          403: {
            description: "User can only cancel own bookings",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse",
                },
              },
            },
          },
          404: {
            description: "Booking not found",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse",
                },
              },
            },
          },
          409: {
            description: "Booking status changed before the update completed",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse",
                },
              },
            },
          },
        },
      },
    },
  },

  schemas: {
    ErrorResponse: {
      type: "object",
      properties: {
        status: {
          type: "string",
          example: "fail",
        },
        message: {
          type: "string",
          example: "Something went wrong",
        },
      },
      required: ["status", "message"],
    },

    BookingStatus: {
      type: "string",
      enum: ["pending", "confirmed", "completed", "cancelled"],
      example: "pending",
    },

    CreateBookingRequest: {
      oneOf: [
        {
          type: "object",
          required: ["session_id", "booking_date", "booking_time"],
          properties: {
            session_id: {
              type: "integer",
              example: 1,
            },
            booking_date: {
              type: "string",
              format: "date",
              example: "2026-06-23",
            },
            booking_time: {
              type: "string",
              example: "18:30",
              description: "Booking time in HH:mm or HH:mm:ss format",
            },
            notes: {
              type: "string",
              maxLength: 1000,
              example: "First personal training session.",
            },
          },
        },
        {
          type: "object",
          required: ["session_id", "session_slot_id"],
          properties: {
            session_id: {
              type: "integer",
              example: 7,
            },
            session_slot_id: {
              type: "integer",
              example: 8,
            },
            notes: {
              type: "string",
              maxLength: 1000,
              example: "Please reserve a place near the front.",
            },
          },
        },
      ],
    },

    Booking: {
      type: "object",
      properties: {
        id: {
          type: "integer",
          example: 1,
        },
        user_id: {
          type: "integer",
          example: 2,
        },
        session_id: {
          type: "integer",
          example: 1,
        },
        session_slot_id: {
          type: "integer",
          nullable: true,
          example: null,
        },
        session_title: {
          type: "string",
          example: "Personal Training",
        },
        session_type: {
          type: "string",
          enum: ["individual", "group"],
          example: "individual",
        },
        booking_date: {
          type: "string",
          format: "date",
          example: "2026-06-23",
        },
        booking_time: {
          type: "string",
          example: "18:30:00",
        },
        status: {
          $ref: "#/components/schemas/BookingStatus",
        },
        notes: {
          type: "string",
          nullable: true,
          example: "First personal training session.",
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

    AdminBooking: {
      allOf: [
        {
          $ref: "#/components/schemas/Booking",
        },
        {
          type: "object",
          properties: {
            user_name: {
              type: "string",
              example: "John Smith",
            },
            user_email: {
              type: "string",
              format: "email",
              example: "john@example.com",
            },
          },
        },
      ],
    },

    BookingResponse: {
      type: "object",
      properties: {
        status: {
          type: "string",
          example: "success",
        },
        data: {
          $ref: "#/components/schemas/Booking",
        },
      },
    },

    AdminBookingResponse: {
      type: "object",
      properties: {
        status: {
          type: "string",
          example: "success",
        },
        data: {
          $ref: "#/components/schemas/AdminBooking",
        },
      },
    },

    BookingListResponse: {
      type: "object",
      properties: {
        status: {
          type: "string",
          example: "success",
        },
        results: {
          type: "integer",
          example: 2,
        },
        data: {
          type: "array",
          items: {
            $ref: "#/components/schemas/Booking",
          },
        },
      },
    },

    AdminBookingListResponse: {
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
            $ref: "#/components/schemas/AdminBooking",
          },
        },
      },
    },
  },
};

module.exports = bookingSwagger;
