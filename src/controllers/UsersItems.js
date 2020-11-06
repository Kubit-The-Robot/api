const { Router } = require("express");

const Item = require("../database/models/Item");
const UsersItems = require("../database/models/UsersItems");
const Kubit = require("../database/models/Kubit");
const User = require("../database/models/User");

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
        this.path = "/client/items";
        this.init();
    }

    init() {
        this.router.get(this.path, privateRoute, this.getUserItems);
        this.router.post(`${this.path}`, privateRoute, this.useItem);
        this.router.post(`${this.path}/equip`, privateRoute, this.equipItem);
        this.router.post(`${this.path}/unequip`, privateRoute, this.unequipItem);
    }

    async getUserItems(req, res) {
        try {
            const { id } = req

            const user = await User.findByPk(id)

            const userItems = await user.getItems()

            const jUserItems = userItems.map(item => item.toJSON())

            res.status(SUCCESS).json({ items: jUserItems })
        } catch (ex) {
            logger.error(e.message || e);
            logger.error(__filename);
            return res.status(INTERNAL_SERVER_ERROR).json({ error: e.message });
        }
    }

    async useItem(req, res) {
        try {
            const { id, body: {
                item_id
            } } = req

            const userItem = await UsersItems.findOne({
                where: {
                    item_id,
                    user_id: id,
                }
            })
            const item = await Item.findByPk(item_id)

            if (
                item.type === "energy" ||
                item.type === "hungry" ||
                item.type === "happiness" ||
                item.type === "experience"
            ) {
                await Kubit.increment(
                    {
                        [item.type]: item.value,
                    },
                    {
                        where: {
                            user_id: id,
                        },
                    }
                );
                if (userItem.quantity === 1) {
                    userItem.destroy()
                } else {
                    userItem.quantity--;
                    userItem.save()
                }
            } else {
                logger.error(
                    "Kubit#useItem failed due to invalid item type"
                );
                return res.status(BAD_REQUEST).json({
                    error: "Não foi possível utilizar o item",
                });
            }

            res.status(SUCCESS).json({ success: true })
        } catch (ex) {
            logger.error(e.message || e);
            logger.error(__filename);
            return res.status(INTERNAL_SERVER_ERROR).json({ error: e.message });
        }
    }

    async equipItem(req, res) {
        try {
            const { id, body: {
                item_id
            } } = req

            const item = await Item.findByPk(item_id)

            if (!item || !item.equipable) {
                logger.error(
                    "Kubit#equipItem failed due to item not equipable"
                );
                return res.status(BAD_REQUEST).json({
                    error: "Item não pode ser equipado",
                });
            }

            await UsersItems.update({
                equipped: 1
            }, {
                where: {
                    user_id: id,
                    item_id
                }
            })

            res.status(SUCCESS).json({ success: true })
        } catch (ex) {
            logger.error(e.message || e);
            logger.error(__filename);
            return res.status(INTERNAL_SERVER_ERROR).json({ error: e.message });
        }
    }

    async unequipItem(req, res) {
        try {
            const { id, body: {
                item_id
            } } = req

            await UsersItems.update({
                equipped: 0
            }, {
                where: {
                    user_id: id,
                    item_id
                }
            })

            res.status(SUCCESS).json({ success: true })
        } catch (ex) {
            logger.error(e.message || e);
            logger.error(__filename);
            return res.status(INTERNAL_SERVER_ERROR).json({ error: e.message });
        }
    }
};
