const { Router } = require("express");

const User = require("../database/models/User");
const Activity = require("../database/models/Activity");
const Category = require("../database/models/Category");
const Item = require("../database/models/Item");
const Emotion = require("../database/models/Emotion");

const {
    SUCCESS,
    INTERNAL_SERVER_ERROR,
} = require("../constants/HttpStatus");

const logger = require("../util/logger");
const privateRoute = require("../middlewares/Auth");

module.exports = class EmotionController {
    constructor() {
        this.router = Router();
        this.path = "/report";
        this.init();
    }

    init() {
        this.router.get(this.path, privateRoute, this.getReport);
    }

    async getReport(req, res) {
        try {
            const { id } = req;

            const report = await User.findOne({
                where: {
                    id
                },
                include: [
                    {
                        model: Item,
                        as: "items"
                    },
                    {
                        model: Activity,
                        as: "activities",
                        include: [
                            {
                                model: Category,
                                as: "categories"
                            }
                        ]
                    },
                    {
                        model: Emotion,
                        as: "emotions",
                    }
                ]
            })

            res.status(SUCCESS).json(report.toJSON())
        } catch (e) {
            logger.error(e.message || e);
            logger.error(__filename);
            return res.status(INTERNAL_SERVER_ERROR).json({ error: e.message });
        }
    }
};
