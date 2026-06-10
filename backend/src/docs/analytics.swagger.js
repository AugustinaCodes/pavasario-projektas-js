const analyticsSwagger = {
  paths: {
    "/api/analytics/me": {
      get: {
        summary: "Get analytics for the current user",
        tags: ["Analytics"],
        security: [
          {
            cookieAuth: [],
          },
        ],
        responses: {
          200: {
            description: "Current user analytics",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/MyAnalyticsResponse",
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

    "/api/analytics/admin": {
      get: {
        summary: "Get admin analytics overview",
        tags: ["Analytics"],
        security: [
          {
            cookieAuth: [],
          },
        ],
        responses: {
          200: {
            description: "Admin analytics overview",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/AdminAnalyticsResponse",
                },
              },
            },
          },
          401: {
            description: "User is not authenticated",
          },
          403: {
            description: "User does not have admin permission",
          },
        },
      },
    },
  },

  schemas: {
    AnalyticsSeriesPoint: {
      type: "object",
      properties: {
        label: {
          type: "string",
        },
        value: {
          type: "integer",
        },
      },
    },

    AdminAnalyticsResponse: {
      type: "object",
      properties: {
        status: {
          type: "string",
          example: "success",
        },
        data: {
          type: "object",
          properties: {
            analytics: {
              type: "object",
              properties: {
                summary: {
                  type: "object",
                  properties: {
                    total_users: { type: "integer" },
                    admin_users: { type: "integer" },
                    regular_users: { type: "integer" },
                    new_users_last_30_days: { type: "integer" },
                    total_sessions: { type: "integer" },
                    individual_sessions: { type: "integer" },
                    group_sessions: { type: "integer" },
                    total_bookings: { type: "integer" },
                    pending_bookings: { type: "integer" },
                    confirmed_bookings: { type: "integer" },
                    completed_bookings: { type: "integer" },
                    cancelled_bookings: { type: "integer" },
                  },
                },
                bookingsByStatus: {
                  type: "array",
                  items: { $ref: "#/components/schemas/AnalyticsSeriesPoint" },
                },
                topSessions: {
                  type: "array",
                  items: { $ref: "#/components/schemas/AnalyticsSeriesPoint" },
                },
                userGrowth: {
                  type: "array",
                  items: { $ref: "#/components/schemas/AnalyticsSeriesPoint" },
                },
                bookingTrend: {
                  type: "array",
                  items: { $ref: "#/components/schemas/AnalyticsSeriesPoint" },
                },
              },
            },
          },
        },
      },
    },

    MyAnalyticsResponse: {
      type: "object",
      properties: {
        status: {
          type: "string",
          example: "success",
        },
        data: {
          type: "object",
          properties: {
            analytics: {
              type: "object",
              properties: {
                summary: {
                  type: "object",
                  properties: {
                    total_bookings: { type: "integer" },
                    pending_bookings: { type: "integer" },
                    confirmed_bookings: { type: "integer" },
                    completed_bookings: { type: "integer" },
                    cancelled_bookings: { type: "integer" },
                    upcoming_bookings: { type: "integer" },
                    active_bookings: { type: "integer" },
                    attendance_rate: { type: ["number", "string"] },
                  },
                },
                bookingsByStatus: {
                  type: "array",
                  items: { $ref: "#/components/schemas/AnalyticsSeriesPoint" },
                },
                recentBookings: {
                  type: "array",
                  items: { $ref: "#/components/schemas/AnalyticsSeriesPoint" },
                },
                favoriteSessions: {
                  type: "array",
                  items: { $ref: "#/components/schemas/AnalyticsSeriesPoint" },
                },
              },
            },
          },
        },
      },
    },
  },
};

module.exports = analyticsSwagger;