const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config(); // ⚠️ Must be at the top!

const { sequelize } = require('./models');

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const medicationRoutes = require('./routes/medicationRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const assignmentRoutes = require('./routes/assignmentRoutes');

const app = express();
app.use(express.json());
const allowedOrigins = process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(',').map(s => s.trim())
    : ['http://localhost:3000'];

app.use(cors({
    origin: (origin, callback) => {
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin)) return callback(null, true);
        return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
    optionsSuccessStatus: 200
}));

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
    console.log('🚫 MOCK MODE ACTIVE – no real DB connection');

    const mockData = require('./mockData');
    global.mockMedications = mockData.mockMedications;
    global.mockNotifications = mockData.mockNotifications;
    global.mockAppointments = mockData.mockAppointments;


    app.listen(PORT, () => {
        console.log(`🚀 CareConnect API läuft im MOCK-Modus auf http://localhost:${PORT}`);
    });
} else {
    const NODE_ENV = process.env.NODE_ENV || 'development';
    const DB_SYNC_FORCE = process.env.DB_SYNC_FORCE === 'true'; 

    if (NODE_ENV === 'production') {
        console.log('Production mode: DB-Sync übersprungen. Bitte Sequelize-Migrations verwenden.');
        sequelize.authenticate()
            .then(() => {
                console.log('Datenbankverbindung hergestellt');
                app.listen(PORT, () => {
                    console.log(`CareConnect API läuft auf http://localhost:${PORT}`);
                });
            })
            .catch((err) => {
                console.error('Fehler bei DB-Verbindung:', err);
                process.exit(1);
            });
    } else {
        // Development/Testing: default { alter: true } zum synchronisieren ohne Datenverlust.
        // DB_SYNC_FORCE=true kann temporär force:true aktivieren (vorsichtig einsetzen).
        const syncOptions = DB_SYNC_FORCE ? { force: true } : { alter: true };
        if (DB_SYNC_FORCE) {
            console.warn('DB_SYNC_FORCE=true — sequelize.sync({ force: true }) wird ausgeführt (Datenverlust möglich).');
        }

        sequelize.sync(syncOptions).then(() => {
            console.log('✅ Datenbank synchronisiert');
            app.listen(PORT, () => {
                console.log(`🚀 CareConnect API läuft auf http://localhost:${PORT}`);
            });
        }).catch((err) => {
            console.error('❌ Fehler bei DB-Verbindung:', err);
            process.exit(1);
        });
    }
}
