module.exports = function(sequelize, DataTypes) {
  var ETFS = sequelize.define("ETFS", {
    ETF: DataTypes.STRING,
    yearmonth: DataTypes.INTEGER,
    yield: DataTypes.FLOAT
  });
  return ETFS;
};
