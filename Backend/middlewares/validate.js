export const validate = (schema) => (req, res, next) => {
    try {
        const result = schema.safeParse(req.body);
        if (!result.success) {
            return res.status(400).json({ errors: result.error.errors });
        }
        req.validatedData = result.data;
        next();
    } catch (err) {
        next(err); 
    }
};
