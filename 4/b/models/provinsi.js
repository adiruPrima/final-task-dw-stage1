'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class provinsi extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  provinsi.init({
    userId: DataTypes.INTEGER,
    nama: DataTypes.STRING,
    diresmikan: DataTypes.DATE,
    photo: DataTypes.STRING,
    pulau: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'provinsi',
  });
  return provinsi;
};