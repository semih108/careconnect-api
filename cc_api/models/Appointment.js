module.exports = (sequelize, DataTypes) => {
    return sequelize.define('Appointment', {
        patient_id: DataTypes.INTEGER,
        caregiver_id: DataTypes.INTEGER,
        relative_id: DataTypes.INTEGER,
        date: DataTypes.DATE,
        time: DataTypes.STRING
    });
};