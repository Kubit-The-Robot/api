const { Router } = require("express");
const cryptoJS = require("crypto-js");

const Kubit = require("../database/models/Kubit");
const Client = require("../database/models/Kubit");

const {
    SUCCESS,
    INTERNAL_SERVER_ERROR,
    BAD_REQUEST,
    CONFLICT,
    NOT_FOUND,
} = require("../constants/HttpStatus");

const logger = require("../util/logger");
const privateRoute = require("../middlewares/Auth");

module.exports = class ClientController {
    constructor() {
        this.router = Router();
        this.path = "/kubit";
        this.init();
    }

    init() {
        this.router.put(this.path, privateRoute, this.updateStatus);
    }

    async updateStatus(req, res) {
        try {
            const {
                id,
                body: { status, quantity },
            } = req;

            if (!status || !quantity) {
                logger.error(
                    "Kubit#updateStatus failed due to missing parameters"
                );
                return res.status(INTERNAL_SERVER_ERROR).json({
                    error: "Não foi possível atualizar os status do Kubit",
                });
            }

            let oldKubit = await Kubit.findOne({
                where: {
                    user_id: id,
                },
            });

            let kubit = await Kubit.increment(
                {
                    [status]: quantity,
                },
                {
                    where: {
                        user_id: id,
                    },
                }
            );

            let client;

            if (
                Number((oldKubit.experience % 100).toFixed(0)) <
                Number((kubit.experience % 100).toFixed(0))
            ) {
                client = await Client.increment(
                    {
                        stars: 1,
                    },
                    {
                        where: {
                            id,
                        },
                    }
                );
            }
            jsonKubit = { ...kubit.toJSON() };
            if (client) {
                jsonKubit.stars = client.stars;
            }

            res.status(200).json(jsonKubit);
        } catch (e) {
            logger.error(e.message || e);
            logger.error(__filename);
            return res.status(INTERNAL_SERVER_ERROR).json({ error: e.message });
        }
    }
};
