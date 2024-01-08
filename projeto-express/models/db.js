const Sequelize = require("sequelize");

const sequelize = new Sequelize("postapp", "root", "1228-OsSp", {
    host: "localhost",
    dialect: "mysql"
});

module.exports = {
    Sequelize: Sequelize,
    sequelize: sequelize
}