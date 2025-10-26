module.exports = (sequelize, DataTypes) => {
    return sequelize.define('Medication', {
        patient_id: DataTypes.INTEGER,
        name: DataTypes.STRING,
        description: DataTypes.STRING,
        dosage: DataTypes.STRING
    });
};