const { DataTypes } = require('sequelize');
 
module.exports = (sequelize) => {
    return sequelize.define('AreaTemplate', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        description: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        action_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        reaction_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        Params: {
            type: DataTypes.JSON,
            allowNull: false
        },
        services: {
            type: DataTypes.JSON,
            allowNull: false
        },
        is_active: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        }
    }, {
        tableName: 'AreaTemplates_info',
        timestamps: true
    });
};
