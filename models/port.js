module.exports = function(sequelize, DataTypes) {
  var PORT = sequelize.define("PORT", {
    name: DataTypes.STRING,
    shv: DataTypes.FLOAT,
    slqd: DataTypes.FLOAT,
    hyg: DataTypes.FLOAT,
    ivv: DataTypes.FLOAT,
    iev: DataTypes.FLOAT,
    eem: DataTypes.FLOAT,
    ewj: DataTypes.FLOAT
  });
  return PORT;
};
