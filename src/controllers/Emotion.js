const { Router } = require("express");

const User = require("../database/models/User");
const Emotion = require("../database/models/Emotion");

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
        this.path = "/emotion";
        this.init();
    }

    init() {
        this.router.get(this.path, privateRoute, this.getAll);
        this.router.post(this.path, privateRoute, this.createUserEmotion);
    }

    async getAll(_, res) {
        try {
            const emotions = await Emotion.findAll()

            const jEmotions = emotions.map(emotion => emotion.toJSON())

            res.status(200).json({ emotions: jEmotions })
        } catch (e) {
            logger.error(e.message || e);
            logger.error(__filename);
            return res.status(INTERNAL_SERVER_ERROR).json({ error: e.message });
        }
    }

    async createUserEmotion(req, res) {
        try {
            const { id, body: {
                emotion_id
            } } = req

            const user = await User.findByPk(id)
            const emotion = await Emotion.findByPk(emotion_id)

            await user.addEmotion(emotion)

            res.status(200).json({ success: true })
        } catch (e) {
            logger.error(e.message || e);
            logger.error(__filename);
            return res.status(INTERNAL_SERVER_ERROR).json({ error: e.message });
        }
    }
};
