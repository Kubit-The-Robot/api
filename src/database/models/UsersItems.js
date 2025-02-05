const { Model, DataTypes } = require("sequelize");

class UsersItems extends Model {
    static init(connection) {
        super.init(
            {
                user_id: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                },
                item_id: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    unique: true,
                },
                quantity: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    defaultValue: 1
                },
                equipped: {
                    type: DataTypes.TINYINT,
                    allowNull: false,
                    defaultValue: 0
                }
            },
            {
                sequelize: connection,
                modelName: "users_items",
                freezeTableName: true,
                name: {
                    singular: true
                }
            }
        );
    }
}

module.exports = UsersItems;
