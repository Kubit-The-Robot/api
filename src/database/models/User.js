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
	}
}

module.exports = User;
