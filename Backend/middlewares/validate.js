export const validate = schema => (req, res, next) => {
    try {
        const result = schema.safeParse(req.body);
        console.log("Request body:", req.body);
        console.log("Validation result:", result);
        if (!result.success) {
            const message = JSON.parse(result.error.message)[0].message;
            return res.status(400).json({ success: false, message });
        }
        req.validatedData = req.body;
        next();
    } catch (err) {
        next(err);
    }
};
