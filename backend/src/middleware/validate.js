const { ZodError } = require("zod");
const AppError = require("../utils/AppError");

const formatZodErrors = (error) => {
    return error.issues.map((issue) => {
        const field = issue.path.join(".");

        return {
            field,
            message: issue.message,
        };
    });
};

const validate = (schema) => {
    return (req, res, next) => {
        try {
            const validatedData = schema.parse({
                body: req.body,
                params: req.params,
                query: req.query,
            });

            req.validated = validatedData;

            next();
        } catch (error) {
            if (error instanceof ZodError) {
                const validationErrors = formatZodErrors(error);
                const appError = new AppError("Validation failed", 400);

                appError.errors = validationErrors;

                return next(appError);
            }

            next(error);
        }
    };
};

module.exports = validate;
