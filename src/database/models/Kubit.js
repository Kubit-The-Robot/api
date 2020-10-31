const { Model, DataTypes } = require("sequelize");

class Kubit extends Model {
    static init(connection) {
        super.init(
            {
                user_id: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                },
                hungry: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    unique: true,
                },
                energy: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                },
                happiness: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                },
                experience: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                },
            },
            {
                sequelize: connection,
                modelName: "kubit",
                freezeTableName: true,
                name: {
                    singular: true
                }
            }
        );
    }

    static associate(models) {
        Kubit.belongsTo(models.User, {
            foreignKey: "user_id",
            as: "users",
        });
    }
}

module.exports = Kubit;
