const { Router } = require("express");
const { sign } = require("jsonwebtoken");
const cryptoJs = require("crypto-js");

const Client = require("../database/models/Client");

const {
	SUCCESS,
	INTERNAL_SERVER_ERROR,
	BAD_REQUEST,
	NOT_FOUND,
	UNAUTHORIZED,
} = require("../constants/HttpStatus");

const logger = require("../util/logger");

module.exports = class AuthController {
	constructor() {
		this.router = Router();
		this.path = "/auth";
		this.init();
	}

	init() {
		this.router.post(this.path, this.store);
	}

	async store(req, res) {
		try {
			const { email } = req.body;

			if (!email) {
				logger.error("Auth#store failed due to missing parameters");
				return res
					.status(BAD_REQUEST)
					.json({ error: "Estão faltando parametros na requisição" });
			}

			const user = await Client.findOne({
				where: {
					email,
				},
			});

			if (!user) {
				logger.error(
					"Auth#store failed due to user not found in database"
				);
				return res
					.status(NOT_FOUND)
					.json({ error: "Esse email não está cadastrado" });
			}

			const token = sign(
				{
					id: user.id,
				},
				process.env.SECRET,
				{
					expiresIn: 3600,
				}
			);

			return res.status(SUCCESS).json({ token });
		} catch (e) {
			logger.error(e.message || e);
			logger.error(__filename);
			return res.status(INTERNAL_SERVER_ERROR).json({ error: e.message });
		}
	}
};
