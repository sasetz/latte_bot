'use strict';
const {
    Model,
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Chapter extends Model {
        static associate(models) {
            models.title.hasMany(Chapter, {
                foreignKey: 'titleId',
            });
            Chapter.belongsTo(models.title);
        }
    }
    Chapter.init({
        name: DataTypes.STRING,
        mangalibId: DataTypes.INTEGER,
        volume: DataTypes.STRING,
        number: DataTypes.STRING,
        publishedAt: DataTypes.DATE,
        titleId: DataTypes.INTEGER,
    }, {
        sequelize,
        modelName: 'chapter',
    });
    return Chapter;
};
