const { Model, DataTypes } = require("sequelize");

class Activity extends Model {
    static init(connection) {
        super.init(
            {
                record: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                },
                name: {
                    type: DataTypes.STRING,
                    allowNull: false,
                    unique: true,
                },
                description: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
                slug: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
            },
            {
                sequelize: connection,
                modelName: "activities",
                freezeTableName: true,
                name: {
                    plural: true
                }
            }
        );
    }

    static associate(models) {
        Activity.belongsToMany(models.User, {
            foreignKey: "activity_id",
            through: "users_activities",
            as: "users"
        })

        Activity.belongsToMany(models.Category, {
            foreignKey: "activity_id",
            through: "activities_categories",
            as: "categories"
        })
    }
}

module.exports = Activity;
