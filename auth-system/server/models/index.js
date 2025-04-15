const Sequelize = require('sequelize');
const sequelize = require('../config/database');
const User = require('./user')(sequelize, Sequelize.DataTypes);

module.exports = { sequelize, User };

const Title = require('./Title')(sequelize, Sequelize.DataTypes);
const Form  = require('./Form')(sequelize, Sequelize.DataTypes);

User.hasMany(Title);
Title.belongsTo(User);
Title.hasMany(Form);
Form.belongsTo(Title);

module.exports = { sequelize, User, Title, Form };
