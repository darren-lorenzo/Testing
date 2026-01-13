const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    return sequelize.define('Workflows', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        user_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
        },
        description: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
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
        last_triggered_value: {
            type: DataTypes.STRING,
            allowNull: true
        },
        is_active: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            allowNull: true
        }
    }, {
        tableName: 'Workflows_info',
        timestamps: false
    });
};
