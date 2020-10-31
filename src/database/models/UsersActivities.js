const { Model, DataTypes } = require("sequelize");

class UsersActivities extends Model {
    static init(connection) {
        super.init(
            {
                user_id: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                },
                activity_id: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    unique: true,
                },
                points: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                },
                finished: {
                    type: DataTypes.TINYINT,
                    allowNull: false,
                },
                difficulty: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                }
            },
            {
                sequelize: connection,
            }
        );
    }
}

module.exports = UsersActivities;
