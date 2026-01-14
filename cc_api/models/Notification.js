module.exports = (sequelize, DataTypes) => {
    return sequelize.define('Notification', {
        user_id: DataTypes.INTEGER,       // Recipient (Relative)
        patient_id: DataTypes.INTEGER,    // Subject (Patient)
        title: DataTypes.STRING,
        text: DataTypes.TEXT,
        type: DataTypes.STRING,
        priority: DataTypes.STRING,
        read: { type: DataTypes.BOOLEAN, defaultValue: false }
    });
};