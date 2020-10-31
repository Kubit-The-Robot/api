const { Router } = require("express");
const UsersActivities = require("../database/models/UsersActivities");

const UsersItems = require("../database/models/UsersItems");
const Activity = require("../database/models/Activity");
const Item = require("../database/models/Item");

const {
    SUCCESS,
    INTERNAL_SERVER_ERROR,
    BAD_REQUEST,
    CONFLICT,
    NOT_FOUND,
} = require("../constants/HttpStatus");

const logger = require("../util/logger");
const privateRoute = require("../middlewares/Auth");

module.exports = class EmotionController {
    constructor() {
        this.router = Router();
        this.path = "/activity";
        this.init();
    }

    init() {
        this.router.get(this.path, privateRoute, this.getAll);
        this.router.post(this.path, privateRoute, this.createUserActivity);
    }

    async getAll(_, res) {
        try {
            const activities = await Activity.findAll()

            const jActivities = activities.map(activity => activity.toJSON())

            res.status(200).json({ activities: jActivities })
        } catch (e) {
            logger.error(e.message || e);
            logger.error(__filename);
            return res.status(INTERNAL_SERVER_ERROR).json({ error: e.message });
        }
    }

    async createUserActivity(req, res) {
        try {
            const { id, body: {
                activity_id,
                points,
                finished,
                difficulty,
            } } = req;

            await UsersActivities.create({
                user_id: id,
                activity_id,
                points,
                finished,
                difficulty
            });

            if (finished) {
                const activity = await Activity.findByPk(activity_id)
                if (!activity) {
                    logger.error(
                        "Activity#createUserActivity failed due to activity not found"
                    );
                    return res.status(INTERNAL_SERVER_ERROR).json({
                        error: "Não foi possível atualizar os status do Kubit",
                    });
                }

                const item = await Item.findByPk(activity.prize)
                if (!item) {
                    logger.error(
                        "Activity#createUserActivity failed due to item prize not found"
                    );
                    return res.status(INTERNAL_SERVER_ERROR).json({
                        error: "Não foi possível atualizar os status do Kubit",
                    });
                }

                const [userItem, created] = await UsersItems.findOrCreate({
                    where: {
                        user_id: id,
                        item_id: item.id,
                    }
                })

                if (!created) {
                    userItem.quantity += difficulty;
                    await userItem.save()
                }
            }

            res.status(200).json({ success: true })
        } catch (e) {
            logger.error(e.message || e);
            logger.error(__filename);
            return res.status(INTERNAL_SERVER_ERROR).json({ error: e.message });
        }
    }
};
