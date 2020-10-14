const { Router } = require("express");
const cryptoJS = require("crypto-js");

const Client = require("../database/models/Client");

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
			const { email, name, age } = req.body;

			if (!email || !name || !age) {
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
			});

			if (!client) {
				logger.error(
					"Client#store failed due to internal server error"
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
				body: { email, name, age },
			} = req;

			if (!email || !name || !age) {
				logger.error("Client#update failed due to missing parameters");
				return res
					.status(BAD_REQUEST)
					.json({ error: "Estão faltando parametros na requisição" });
			}

			const [, [client]] = await Client.update(
				{
					name,
					email,
					age,
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
