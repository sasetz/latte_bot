'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Team extends Model {
    static associate(models) {
    }
  }
  Team.init({
    name: DataTypes.STRING,
    timeout: DataTypes.INTEGER,
    mangalibId: DataTypes.INTEGER,
    channelId: DataTypes.STRING,
    serverId: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'team',
  });
  return Team;
};
