const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    return sequelize.define('Action', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
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
        Service: {
            type: DataTypes.JSON,
            allowNull: false,
        },
        Params: {
            type: DataTypes.JSON,
            allowNull: false,
        }
    }, {
        tableName: 'Action_info',
        timestamps: false
    });
};
