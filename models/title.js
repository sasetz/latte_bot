'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Title extends Model {
    static associate(models) {
      models.team.hasMany(Title, {
        foreignKey: 'teamId',
      });
      Title.belongsTo(models.team);
    }
  }
  Title.init({
    titleJp: DataTypes.STRING,
    titleEn: DataTypes.STRING,
    titleRu: DataTypes.STRING,
    mangalibId: DataTypes.INTEGER,
    siteId: DataTypes.INTEGER,
    roleId: DataTypes.STRING,
    teamId: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'title',
  });
  return Title;
};
