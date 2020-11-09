const { Model, DataTypes } = require("sequelize");

class Item extends Model {
    static init(connection) {
        super.init(
            {
                slug: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
                type: {
                    type: DataTypes.STRING,
                    allowNull: false,
                    unique: true,
                },
                value: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                },
                name: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
                price: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                },
                equipable: {
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
        Item.belongsToMany(models.User, {
            foreignKey: "item_id",
            through: "users_items",
            as: "users"
        })
    }
}

module.exports = Item;
