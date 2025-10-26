module.exports = (sequelize, DataTypes) => {
    return sequelize.define('Assignment', {
        caregiver_id: DataTypes.INTEGER,
        patient_id: DataTypes.INTEGER
    });
};