const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    return sequelize.define('Services', {
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
        service: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        logo: {
            type: DataTypes.STRING,
            allowNull: false
        },
        color: {
            type: DataTypes.STRING,
            allowNull: false
        },
        actions: {
            type: DataTypes.JSON,
            allowNull: true,
        },
        reactions: {
            type: DataTypes.JSON,
            allowNull: true,
        }
    }, {
        tableName: 'Services_info',
        timestamps: false

    });
};