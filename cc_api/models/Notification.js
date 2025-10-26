module.exports = (sequelize, DataTypes) => {
    return sequelize.define('Notification', {
        user_id: DataTypes.INTEGER,
        text: DataTypes.STRING,
        read: { type: DataTypes.BOOLEAN, defaultValue: false }
    });
};