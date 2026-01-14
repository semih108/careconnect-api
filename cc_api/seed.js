require('dotenv').config();
const path = require('path');
const { mockUsers } = require(path.resolve(__dirname, './mockDB'));

const { sequelize, User, Appointment, Medication, Notification, Assignment, Relationship } = require('./models');
const bcrypt = require('bcryptjs');

async function seed() {
    await sequelize.sync({ force: true });
    console.log('📦 Datenbank geleert und neu aufgebaut');

    const passwordHash = await bcrypt.hash('123456', 10);

    // Create Users
    const admin = await User.create({ 
        name: 'Admin User', 
        email: 'admin@careconnect.com', 
        password: passwordHash, 
        phone: '+49 30 12345678',
        address: 'Hauptstraße 1, 10115 Berlin',
        role: 'admin' 
    });
    
    const caregiver1 = await User.create({ 
        name: 'Pflegekraft Franz', 
        email: 'franz@pflege.at', 
        password: passwordHash,
        phone: '+43 1 234567',
        address: 'Pflegeweg 5, 1010 Wien', 
        role: 'caregiver' 
    });
    
    const caregiver2 = await User.create({ 
        name: 'Maria Schmidt', 
        email: 'maria@pflege.at', 
        password: passwordHash,
        phone: '+43 1 234568',
        address: 'Pflegeweg 7, 1010 Wien', 
        role: 'caregiver' 
    });
    
    // Create Patients (data records only, no login)
    const patient1 = await User.create({ 
        name: 'Herr Müller', 
        email: null,  // Kein Login
        password: null,
        phone: '+49 30 555111',
        address: 'Parkstraße 23, 10178 Berlin', 
        role: 'patient' 
    });
    
    const patient2 = await User.create({ 
        name: 'Frau Schmidt', 
        email: null,  // Kein Login
        password: null,
        phone: '+49 30 555222',
        address: 'Hauptstraße 45, 10179 Berlin', 
        role: 'patient' 
    });
    
    const patient3 = await User.create({ 
        name: 'Herr Wagner', 
        email: null,  // Kein Login
        password: null,
        phone: '+43 1 555333',
        address: 'Wiener Straße 88, 1020 Wien', 
        role: 'patient' 
    });
    
    // Create Relatives (mit Login - alte Patienten-Accounts umgewandelt)
    const relative1 = await User.create({ 
        name: 'Anna Müller', 
        email: 'anna.mueller@familie.at', 
        password: passwordHash,
        phone: '+49 160 1234567',
        address: 'Parkstraße 25, 10178 Berlin', 
        role: 'relative' 
    });
    
    const relative2 = await User.create({ 
        name: 'Thomas Schmidt', 
        email: 'thomas.schmidt@familie.at', 
        password: passwordHash,
        phone: '+49 160 7654321',
        address: 'Hauptstraße 47, 10179 Berlin', 
        role: 'relative' 
    });
    
    const relative3 = await User.create({ 
        name: 'Sandra Wagner', 
        email: 'sandra.wagner@familie.at', 
        password: passwordHash,
        phone: '+43 660 9876543',
        address: 'Wiener Straße 90, 1020 Wien', 
        role: 'relative' 
    });

    // Create Medications
    await Medication.create({ 
        patient_id: patient1.id, 
        name: 'Ramipril', 
        description: 'Blutdrucksenker - morgens einnehmen', 
        dosage: '5mg täglich' 
    });
    
    await Medication.create({ 
        patient_id: patient1.id, 
        name: 'Aspirin', 
        description: 'Blutverdünner', 
        dosage: '100mg täglich' 
    });
    
    await Medication.create({ 
        patient_id: patient2.id, 
        name: 'Metformin', 
        description: 'Diabetes Medikament', 
        dosage: '500mg 2x täglich' 
    });
    
    await Medication.create({ 
        patient_id: patient2.id, 
        name: 'Simvastatin', 
        description: 'Cholesterinsenker', 
        dosage: '20mg abends' 
    });
    
    await Medication.create({ 
        patient_id: patient3.id, 
        name: 'Ibuprofen', 
        description: 'Schmerzmittel bei Bedarf', 
        dosage: '400mg bei Schmerzen' 
    });

    // Create Appointments
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);
    
    await Appointment.create({ 
        patient_id: patient1.id, 
        caregiver_id: caregiver1.id,
        title: 'Routinekontrolle',
        description: 'Regelmäßige Gesundheitsprüfung und Blutdruckmessung',
        location: 'Pflegeeinrichtung Sonnenhof, Raum 12',
        date: today, 
        time: '09:00',
        type: 'checkup'
    });
    
    await Appointment.create({ 
        patient_id: patient1.id, 
        caregiver_id: caregiver1.id,
        title: 'Medikamentenberatung',
        description: 'Besprechung der aktuellen Medikation und Dosierung',
        location: 'Pflegeeinrichtung Sonnenhof, Beratungszimmer',
        date: tomorrow, 
        time: '14:30',
        type: 'consultation'
    });
    
    await Appointment.create({ 
        patient_id: patient2.id, 
        caregiver_id: caregiver2.id,
        title: 'Physiotherapie',
        description: 'Bewegungsübungen für die Mobilität',
        location: 'Therapieraum, 1. Stock',
        date: tomorrow, 
        time: '10:00',
        type: 'therapy'
    });
    
    await Appointment.create({ 
        patient_id: patient2.id, 
        caregiver_id: caregiver1.id,
        title: 'Arzttermin',
        description: 'Kontrolle beim Hausarzt Dr. Müller',
        location: 'Arztpraxis Dr. Müller, Hauptstraße 45',
        date: nextWeek, 
        time: '11:30',
        type: 'doctor'
    });
    
    await Appointment.create({ 
        patient_id: patient3.id, 
        caregiver_id: caregiver2.id,
        title: 'Erstgespräch',
        description: 'Kennenlernen und Bedarfsermittlung',
        location: 'Pflegeeinrichtung Sonnenhof, Büro',
        date: nextWeek, 
        time: '15:00',
        type: 'consultation'
    });

    // Create Notifications (FROM Caregiver TO Relatives ABOUT Patients)
    await Notification.create({ 
        user_id: relative1.id,           // Empfänger: Anna
        patient_id: patient1.id,         // Betreff: Herr Müller
        title: 'Gute Nachricht',
        text: 'Ihr Vater hatte heute einen sehr guten Tag! Er war fröhlich und hat viel erzählt.',
        type: 'emotional',
        priority: 'low',
        read: false
    });
    
    await Notification.create({ 
        user_id: relative1.id,           // Empfänger: Anna
        patient_id: patient1.id,         // Betreff: Herr Müller
        title: 'Besuchswunsch',
        text: 'Herr Müller vermisst Sie sehr. Ein Besuch würde ihm sicher gut tun.',
        type: 'social',
        priority: 'medium',
        read: false
    });
    
    await Notification.create({ 
        user_id: relative2.id,           // Empfänger: Thomas
        patient_id: patient2.id,         // Betreff: Frau Schmidt
        title: 'Gesundheitszustand',
        text: 'Frau Schmidt hat heute sehr gut gegessen und alle Medikamente eingenommen.',
        type: 'health',
        priority: 'medium',
        read: false
    });
    
    await Notification.create({ 
        user_id: relative2.id,           // Empfänger: Thomas
        patient_id: patient2.id,         // Betreff: Frau Schmidt
        title: 'Physiotherapie',
        text: 'Die Physiotherapie verläuft sehr gut. Frau Schmidt macht tolle Fortschritte!',
        type: 'health',
        priority: 'low',
        read: true
    });
    
    await Notification.create({ 
        user_id: relative3.id,           // Empfänger: Sandra
        patient_id: patient3.id,         // Betreff: Herr Wagner
        title: 'Stimmung heute',
        text: 'Herr Wagner war heute besonders gut gelaunt und hat beim Mittagessen mit anderen Bewohnern gelacht.',
        type: 'emotional',
        priority: 'low',
        read: false
    });
    
    await Notification.create({ 
        user_id: relative3.id,           // Empfänger: Sandra
        patient_id: patient3.id,         // Betreff: Herr Wagner
        title: 'Schlafqualität',
        text: 'Herr Wagner hat letzte Nacht sehr gut geschlafen und ist heute ausgeruht.',
        type: 'health',
        priority: 'low',
        read: false
    });
    
    await Notification.create({ 
        user_id: relative1.id,           // Empfänger: Anna
        patient_id: patient1.id,         // Betreff: Herr Müller
        title: 'Erinnerung',
        text: 'Herr Müller erzählt häufig von Ihren gemeinsamen Urlauben. Vielleicht könnten Sie Fotos mitbringen?',
        type: 'social',
        priority: 'low',
        read: false
    });

    // Create Assignments
    await Assignment.create({ caregiver_id: caregiver1.id, patient_id: patient1.id });
    await Assignment.create({ caregiver_id: caregiver1.id, patient_id: patient2.id });
    await Assignment.create({ caregiver_id: caregiver2.id, patient_id: patient2.id });
    await Assignment.create({ caregiver_id: caregiver2.id, patient_id: patient3.id });

    // Create Relationships (Angehörige-Patienten Beziehungen)
    await Relationship.create({ 
        relative_id: relative1.id, 
        patient_id: patient1.id, 
        relationship_type: 'daughter'  // Anna ist Tochter von Herr Müller
    });
    await Relationship.create({ 
        relative_id: relative2.id, 
        patient_id: patient2.id, 
        relationship_type: 'son'  // Thomas ist Sohn von Frau Schmidt
    });
    await Relationship.create({ 
        relative_id: relative3.id, 
        patient_id: patient3.id, 
        relationship_type: 'daughter'  // Sandra ist Tochter von Herr Wagner
    });

    console.log('📦 MOCK USERS AM ENDE:', mockUsers);
    console.log('✅ Umfangreiche Dummy-Daten erfolgreich eingefügt:');
    console.log('   - 9 Benutzer (1 Admin, 2 Pfleger, 3 Patienten [ohne Login], 3 Angehörige)');
    console.log('   - 5 Medikamente');
    console.log('   - 5 Termine');
    console.log('   - 7 Benachrichtigungen');
    console.log('   - 4 Zuweisungen (Pfleger-Patient)');
    console.log('   - 3 Beziehungen (Angehörige-Patient: 1:1)');
    process.exit();
}

seed();
