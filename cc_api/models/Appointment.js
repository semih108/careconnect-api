module.exports = (sequelize, DataTypes) => {
    return sequelize.define('Appointment', {
        patient_id: DataTypes.INTEGER,
        caregiver_id: DataTypes.INTEGER,
        relative_id: DataTypes.INTEGER,
        title: DataTypes.STRING,
        description: DataTypes.TEXT,
        location: DataTypes.STRING,
        date: DataTypes.DATE,
        time: DataTypes.STRING,
        type: DataTypes.STRING
    });
};