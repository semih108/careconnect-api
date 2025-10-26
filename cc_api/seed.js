require('dotenv').config();
const path = require('path');
const { mockUsers } = require(path.resolve(__dirname, './mockDB'));



const { sequelize, User, Appointment, Medication, Notification, Assignment } = require('./models');
const bcrypt = require('bcryptjs');

async function seed() {
    await sequelize.sync({ force: true });
    console.log('📦 Datenbank geleert und neu aufgebaut');

    const passwordHash = await bcrypt.hash('123456', 10);

    const admin = await User.create({ name: 'Admin User', email: 'admin@careconnect.com', password: passwordHash, role: 'admin' });
    const caregiver = await User.create({ name: 'Pflegekraft Franz', email: 'franz@pflege.at', password: passwordHash, role: 'caregiver' });
    const patient = await User.create({ name: 'Oma Erna', email: 'erna@care.at', password: passwordHash, role: 'patient' });
    const relative = await User.create({ name: 'Hans Enkel', email: 'hans@familie.at', password: passwordHash, role: 'relative' });

    await Appointment.create({ patient_id: patient.id, caregiver_id: caregiver.id, date: new Date(), time: '09:00' });
    await Medication.create({ patient_id: patient.id, name: 'Ramipril', description: 'Blutdrucksenker', dosage: '5mg' });
    await Notification.create({ user_id: patient.id, text: 'Erinnerung: Termin morgen um 09:00 Uhr' });
    await Assignment.create({ caregiver_id: caregiver.id, patient_id: patient.id });

    console.log('📦 MOCK USERS AM ENDE:', mockUsers);
    console.log('✅ Dummy-Daten erfolgreich eingefügt');
    process.exit();
}

seed();
