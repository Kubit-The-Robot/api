const { Router } = require("express");

const Item = require("../database/models/Item");
const Client = require("../database/models/User");

const {
    INTERNAL_SERVER_ERROR,
    BAD_REQUEST,
    NOT_FOUND,
} = require("../constants/HttpStatus");

const logger = require("../util/logger");
const privateRoute = require("../middlewares/Auth");

module.exports = class StoreController {
    constructor() {
        this.router = Router();
        this.path = "/store";
        this.init();
    }

    init() {
        this.router.get(this.path, privateRoute, this.getAllItems)
        // this.router.post(`${this.path}/:slug`, privateRoute, this.buyItem)
    }

    async getAllItems(_, res) {
        try {
            const items = await Item.findAll()
            if (!items || !items.length) {
                logger.error("Store#getAllItems failed due to internal server error");
                return res
                    .status(INTERNAL_SERVER_ERROR)
                    .json({
                        error: "Houve um problema ao achar os itens da loja",
                    });
            }

            const jItems = items.map(item => {
                return item.toJSON()
            })

            res.status(200).json(jItems)
        } catch (e) {
            logger.error(e.message || e);
            logger.error(__filename);
            return res.status(INTERNAL_SERVER_ERROR).json({ error: e.message });
        }
    }

    async buyItem(req, res) {
        try {
            const { id, params: { slug } } = req

            const client = await Client.findByPk(id)
            if (!client) {
                logger.error(
                    "Store#buyItem failed due to client not found in database"
                );
                res.status(NOT_FOUND).json({
                    error:
                        "Não foi possível encontrar o seu usuário, por favor, entre em contato com o nosso suporte",
                });
            }
            const item = await Item.findOne({
                where: {
                    slug
                }
            })
            if (!item) {
                logger.error(
                    "Store#buyItem failed due to item not found in database"
                );
                res.status(NOT_FOUND).json({
                    error:
                        "Não foi possível encontrar o item, por favor, entre em contato com o nosso suporte",
                });
            }

            if (client.stars < item.price) {
                logger.error(
                    "Store#buyItem failed due to insuficient stars"
                );
                res.status(BAD_REQUEST).json({
                    error:
                        "Você não possui estrelas suficientes para a compra desse item",
                });
            }

            await client.addItem(item)

            res.status(200).json({
                success: true
            })
        } catch (e) {
            logger.error(e.message || e);
            logger.error(__filename);
            return res.status(INTERNAL_SERVER_ERROR).json({ error: e.message });
        }
    }
};
