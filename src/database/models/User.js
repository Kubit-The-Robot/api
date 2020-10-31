const { Model, DataTypes } = require("sequelize");

class User extends Model {
	static init(connection) {
		super.init(
			{
				name: {
					type: DataTypes.STRING,
					allowNull: false,
				},
				email: {
					type: DataTypes.STRING,
					allowNull: false,
					unique: true,
				},
				age: {
					type: DataTypes.INTEGER,
					allowNull: false,
				},
				avatar_photo: {
					type: DataTypes.STRING,
					allowNull: false,
				},
				stars: {
					type: DataTypes.INTEGER,
					allowNull: false,
				},
			},
			{
				sequelize: connection,
			}
		);
	}

	static associate(models) {
		User.belongsToMany(models.Item, {
			foreignKey: "user_id",
			through: "users_items",
			as: "items"
		})
		User.belongsToMany(models.activities, {
			foreignKey: "user_id",
			through: "users_activities",
			as: "activities"
		})
		User.belongsToMany(models.Emotion, {
			foreignKey: "user_id",
			through: "users_emotions",
			as: "emotions"
		})
		User.hasMany(models.Session, {
			foreignKey: "user_id",
			as: "sessions"
		})
	}
}

module.exports = User;
