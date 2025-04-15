module.exports = (sequelize, DataTypes) => {
    return sequelize.define('Form', {
      name: { type: DataTypes.STRING, allowNull: false },
      TitleId: { type: DataTypes.INTEGER, allowNull: false }
    });
  };
  