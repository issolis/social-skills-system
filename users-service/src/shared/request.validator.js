export default class RequestValidator {
    static validateIdParam(id) {
        if (id === undefined || id === null || id === "") {
            return "ID is required";
        }

        const parsedId = Number(id);

        if (!Number.isInteger(parsedId) || parsedId <= 0) {
            return "ID must be a positive integer";
        }

        return null;
    }

    static validateRequiredString(value, fieldName, min = 1, max = 255) {
        if (value === undefined || value === null) {
            return `${fieldName} is required`;
        }

        if (typeof value !== "string") {
            return `${fieldName} must be a string`;
        }

        const trimmed = value.trim();

        if (trimmed.length < min) {
            return `${fieldName} must be at least ${min} character(s)`;
        }

        if (trimmed.length > max) {
            return `${fieldName} must be at most ${max} character(s)`;
        }

        return null;
    }

    static validateOptionalString(value, fieldName, min = 1, max = 255) {
        if (value === undefined) {
            return null;
        }

        if (value === null || typeof value !== "string") {
            return `${fieldName} must be a string`;
        }

        const trimmed = value.trim();

        if (trimmed.length < min) {
            return `${fieldName} must be at least ${min} character(s)`;
        }

        if (trimmed.length > max) {
            return `${fieldName} must be at most ${max} character(s)`;
        }

        return null;
    }

    static validateRequiredBody(body) {
        if (!body || typeof body !== "object" || Array.isArray(body)) {
            return "Request body is required";
        }

        return null;
    }
}