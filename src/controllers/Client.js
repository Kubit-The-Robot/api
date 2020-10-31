const { Router } = require("express");
const cryptoJS = require("crypto-js");

const Client = require("../database/models/User");
const Kubit = require("../database/models/Kubit");

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
		this.path = "/client";
		this.init();
	}

	init() {
		this.router.post(this.path, this.store);
		this.router.put(this.path, privateRoute, this.update);
		this.router.get(this.path, privateRoute, this.index);
	}

	async store(req, res) {
		try {
			const { email, name, age, avatarPhoto } = req.body;

			if (!email || !name || !age || !avatarPhoto) {
				logger.error("Client#store failed due to missing parameters");
				return res
					.status(BAD_REQUEST)
					.json({ error: "Estão faltando parametros na requisição" });
			}

			const oldClient = await Client.findOne({
				where: {
					email,
				},
			});

			if (oldClient) {
				logger.error("Client#store failed due to email already exists");
				return res
					.status(CONFLICT)
					.json({
						error: "Esse email já está cadastrado em nosso sistema",
					});
			}

			const client = await Client.create({
				name,
				email,
				age,
				avatar_photo: avatarPhoto,
				stars: 0,
			});

			if (!client) {
				logger.error(
					"Client#store failed due to client creation internal server error"
				);
				return res.status(INTERNAL_SERVER_ERROR).json({
					error:
						"Não foi possível realizar a criação de usuário, por favor, entre em contato com o nosso suporte",
				});
			}

			const kubit = await Kubit.create({
				hungry: 10,
				energy: 10,
				happiness: 10,
				experience: 0,
				user_id: client.id,
			});

			if (!kubit) {
				logger.error(
					"Client#store failed due to kubit creation internal server error"
				);
				return res.status(INTERNAL_SERVER_ERROR).json({
					error:
						"Não foi possível realizar a criação de usuário, por favor, entre em contato com o nosso suporte",
				});
			}

			return res.status(SUCCESS).json({ success: true });
		} catch (e) {
			logger.error(e.message || e);
			logger.error(__filename);
			return res.status(INTERNAL_SERVER_ERROR).json({ error: e.message });
		}
	}

	async update(req, res) {
		try {
			const {
				id,
				body: { email, name, age, avatarPhoto },
			} = req;

			if (!email || !name || !age || !avatarPhoto) {
				logger.error("Client#update failed due to missing parameters");
				return res
					.status(BAD_REQUEST)
					.json({ error: "Estão faltando parametros na requisição" });
			}

			const [client] = await Client.update(
				{
					name,
					email,
					age,
					avatar_photo: avatarPhoto
				},
				{
					where: {
						id,
					},
				}
			);

			if (!client) {
				logger.error(
					"Client#update failed due to client not found in database"
				);
				return res.status(NOT_FOUND).json({
					error:
						"Não foi possível atualizar seu usuário, por favor, entre em contato com o nosso suporte",
				});
			}

			return res.status(SUCCESS).json({ success: true });
		} catch (e) {
			logger.error(e.message || e);
			logger.error(__filename);
			return res.status(INTERNAL_SERVER_ERROR).json({ error: e.message });
		}
	}

	async index(req, res) {
		try {
			const { id } = req;

			const client = await Client.findByPk(id);

			if (!client) {
				logger.error(
					"Client#index failed due to client not found in database"
				);
				res.status(NOT_FOUND).json({
					error:
						"Não foi possível encontrar o seu usuário, por favor, entre em contato com o nosso suporte",
				});
			}

			return res.status(SUCCESS).json(client.toJSON());
		} catch (e) {
			logger.error(e.message || e);
			logger.error(__filename);
			return res.status(INTERNAL_SERVER_ERROR).json({ error: e.message });
		}
	}
};
