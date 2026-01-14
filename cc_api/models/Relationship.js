module.exports = (sequelize, DataTypes) => {
    return sequelize.define('Relationship', {
        relative_id: DataTypes.INTEGER,
        patient_id: DataTypes.INTEGER,
        relationship_type: {
            type: DataTypes.STRING,
            defaultValue: 'family'
        }
    });
};
