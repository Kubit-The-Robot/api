const { Model, DataTypes } = require("sequelize");

class Emotion extends Model {
    static init(connection) {
        super.init(
            {
                name: {
                    type: DataTypes.STRING,
                    allowNull: false,
                }
            },
            {
                sequelize: connection,
            }
        );
    }

    static associate(models) {
        Emotion.belongsToMany(models.User, {
            foreignKey: "emotion_id",
            through: "users_emotions",
            as: "users"
        })
    }
}

module.exports = Emotion;
