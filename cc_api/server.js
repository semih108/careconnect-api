const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config(); // ⚠️ Muss ganz oben stehen!

const { sequelize } = require('./models');

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const medicationRoutes = require('./routes/medicationRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const assignmentRoutes = require('./routes/assignmentRoutes');

const app = express();
app.use(express.json());
app.use(cors());

// Routen-Mounting
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/appointments', appointmentRoutes);
app.use('/medications', medicationRoutes);
app.use('/notifications', notificationRoutes);
app.use('/caregivers', assignmentRoutes);

// Port & Mock-Modus prüfen
const PORT = process.env.PORT || 3000;
const isMock = process.env.USE_MOCK === 'true';

if (isMock) {
    console.log('🚫 MOCK-MODUS AKTIV – keine echte DB-Verbindung');

    const mockData = require('./mockData');
    global.mockMedications = mockData.mockMedications;
    global.mockNotifications = mockData.mockNotifications;
    global.mockAppointments = mockData.mockAppointments;


    app.listen(PORT, () => {
        console.log(`🚀 CareConnect API läuft im MOCK-Modus auf http://localhost:${PORT}`);
    });
} else {
    sequelize.sync({ force: true }).then(() => {
        console.log('✅ Datenbank synchronisiert');
        app.listen(PORT, () => {
            console.log(`🚀 CareConnect API läuft auf http://localhost:${PORT}`);
        });
    }).catch((err) => {
        console.error('❌ Fehler bei DB-Verbindung:', err);
    });
}
