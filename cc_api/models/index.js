const useMock = process.env.USE_MOCK === 'true';
const path = require('path');
const { mockUsers } = require(path.resolve(__dirname, '../mockDB'));


if (useMock) {
    console.log('⚠️ MOCK-MODUS AKTIV');

    const { mockUsers } = require('../mockDB');

    const User = {
        async create(data) {
            const user = { id: mockUsers.length + 1, ...data };
            mockUsers.push(user);
            return user;
        },
        async findOne({ where }) {
            return mockUsers.find(user => user.email === where.email) || null;
        },
        async findAll() {
            return mockUsers;
        }
    };

    const Appointment = {
        async create(data) {
            console.log('📝 Termin erstellt:');
        }
    };

    const Medication = {
        async create(data) {
            console.log('💊 Medikament erstellt:');
        }
    };

    const Notification = {
        async create(data) {
            console.log('🔔 Benachrichtigung erstellt');
        }
    };

    const Assignment = {
        async create(data) {
            console.log('👥 Zuweisung erstellt');
        }
    };

    const Relationship = {
        async create(data) {
            console.log('👨‍👩‍👦 Beziehung erstellt:');
        }
    };

    module.exports = {
        sequelize: {
            sync: async () => console.log('⚠️ [MOCK] DB-Sync übersprungen')
        },
        User,
        Appointment,
        Medication,
        Notification,
        Assignment,
        Relationship
    };

} else {
    // ECHTDB-Modus
    const Sequelize = require('sequelize');
    const sequelize = require('../config/db');

    const User = require('./User')(sequelize, Sequelize.DataTypes);
    const Appointment = require('./Appointment')(sequelize, Sequelize.DataTypes);
    const Medication = require('./Medication')(sequelize, Sequelize.DataTypes);
    const Notification = require('./Notification')(sequelize, Sequelize.DataTypes);
    const Assignment = require('./Assignment')(sequelize, Sequelize.DataTypes);
    const Relationship = require('./Relationship')(sequelize, Sequelize.DataTypes);

    User.hasMany(Appointment, { foreignKey: 'patient_id' });
    User.hasMany(Appointment, { foreignKey: 'caregiver_id' });
    User.hasMany(Medication, { foreignKey: 'patient_id' });
    User.hasMany(Notification, { foreignKey: 'user_id' });
    User.hasMany(Notification, { foreignKey: 'patient_id' });

    Appointment.belongsTo(User, { as: 'patient', foreignKey: 'patient_id' });
    Appointment.belongsTo(User, { as: 'caregiver', foreignKey: 'caregiver_id' });

    Notification.belongsTo(User, { as: 'patient', foreignKey: 'patient_id' });

    Assignment.belongsTo(User, { as: 'caregiver', foreignKey: 'caregiver_id' });
    Assignment.belongsTo(User, { as: 'patient', foreignKey: 'patient_id' });

    Relationship.belongsTo(User, { as: 'relative', foreignKey: 'relative_id' });
    Relationship.belongsTo(User, { as: 'patient', foreignKey: 'patient_id' });

    module.exports = {
        sequelize,
        User,
        Appointment,
        Medication,
        Notification,
        Assignment,
        Relationship
    };
}
