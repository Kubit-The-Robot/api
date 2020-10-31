const { Model, DataTypes } = require("sequelize");

class Category extends Model {
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
        Category.belongsToMany(models.Activity, {
            foreignKey: "category_id",
            through: "activities_categories",
            as: "activities"
        })
    }
}

module.exports = Category;
