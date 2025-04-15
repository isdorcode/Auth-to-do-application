module.exports = (sequelize, DataTypes) => {
    return sequelize.define('Title', {
      name: { type: DataTypes.STRING, allowNull: false },
      UserId: { type: DataTypes.INTEGER, allowNull: false }
    });
  };
  