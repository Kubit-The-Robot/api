const { Model, DataTypes } = require("sequelize");

class Session extends Model {
    static init(connection) {
        super.init(
            {
                token: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
                expires_at: {
                    type: DataTypes.TEXT,
                    allowNull: false,
                },
            },
            {
                sequelize: connection,
            }
        );
    }

    static associate(models) {
        Session.belongsTo(models.User, {
            foreignKey: "user_id",
            as: "users"
        })
    }
}

module.exports = Session;
