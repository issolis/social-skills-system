export default class UserSkillValidator {
    static validateCreate(req, res, next) {
        const { user_id, skill_id, pts_assigned } = req.body;

        if (!user_id || !skill_id || pts_assigned == null) {
            return res.status(400).json({
                error: "Missing required fields"
            });
        }

        next();
    }
}
