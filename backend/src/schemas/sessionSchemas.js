const { z } = require("zod");

const sessionIdParamSchema = z.object({
  params: z.object({
    id: z.coerce
      .number({
        message: "Session ID is required",
      })
      .int("Session ID must be an integer")
      .positive("Session ID must be a positive number"),
  }),
});

module.exports = {
  sessionIdParamSchema,
};
