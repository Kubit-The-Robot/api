require("dotenv").config();

module.exports = {
	dialect: "mysql",
	host: process.env.DB_HOST,
	username: process.env.DB_USERNAME,
	password: process.env.DB_PASSWORD,
	database: "kubit",
	define: {
		timestamps: true,
		underscored: true,
	},
};
