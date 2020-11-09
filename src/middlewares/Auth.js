const jwt = require("jsonwebtoken");

const Client = require("../database/models/User");

const { UNAUTHORIZED } = require("../constants/HttpStatus");

const logger = require("../util/logger");

module.exports = async (req, res, next) => {
	try {
		if (!req.headers || !req.headers.token) {
			logger.error("Authentication error, token not found in the headers");
			res.status(UNAUTHORIZED).json({
				error:
					"O token utilizado está inválido, por favor, refaça seu login"
			});
		}

		const client = await Client.findOne({
			where: {
				email: req.headers.token
			}
		})
		if (!client) {
			logger.error("Authentication error, token not found in the headers");
			res.status(UNAUTHORIZED).json({
				error:
					"O token utilizado está inválido, por favor, refaça seu login"
			});
		}

		req.id = client.id

		// req.id = jwt.verify(req.headers.token, process.env.SECRET).id;
		return next();
	} catch (ex) {
		res.status(UNAUTHORIZED).json({
			error:
				"O token utilizado está inválido, por favor, refaça seu login"
		});
	}
};