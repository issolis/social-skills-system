import RequestValidator from "../../shared/request.validator.js";

export default class UserValidator {
    static validateGetById(req, res, next) {
        const idError = RequestValidator.validateIdParam(req.params.id);

        if (idError) {
            return res.status(400).json({ message: idError });
        }

        next();
    }

    static validateCreate(req, res, next) {
        const bodyError = RequestValidator.validateRequiredBody(req.body);

        if (bodyError) {
            return res.status(400).json({ message: bodyError });
        }

        const fieldsError = RequestValidator.validateFields(
            req.body,
            ["username", "fname", "lname", "password", "role_id"]
        );

        if (fieldsError !== true) {
            return res.status(400).json({ message: fieldsError });
        }

        const { username, fname, lname, password, role_id } = req.body;

        const errors = [
            RequestValidator.validateRequiredString(username, "username"),
            RequestValidator.validateRequiredString(fname, "fname"),
            RequestValidator.validateRequiredString(lname, "lname"),
            RequestValidator.validateRequiredString(password, "password")
        ].filter(Boolean);

        if (errors.length > 0) {
            return res.status(400).json({ message: errors[0] });
        }


        next();
    }

    static validateUpdate(req, res, next) {
        const idError = RequestValidator.validateIdParam(req.params.id);

        if (idError) {
            return res.status(400).json({ message: idError });
        }

        const bodyError = RequestValidator.validateRequiredBody(req.body);

        if (bodyError) {
            return res.status(400).json({ message: bodyError });
        }

        const { username, fname, lname } = req.body;

        const errors = [
            RequestValidator.validateRequiredString(username, "username"),
            RequestValidator.validateRequiredString(fname, "fname"),
            RequestValidator.validateRequiredString(lname, "lname")
        ].filter(Boolean);

        if (errors.length > 0) {
            return res.status(400).json({ message: errors[0] });
        }

        next();
    }

    static validateDelete(req, res, next) {
        const idError = RequestValidator.validateIdParam(req.params.id);

        if (idError) {
            return res.status(400).json({ message: idError });
        }

        next();
    }
}