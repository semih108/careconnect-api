
const mockMedications = [
    { id: '1', name: 'Aspirin', dosage: '100mg', patientId: '101', description: 'Schmerzmittel und Fiebersenker' },
    { id: '2', name: 'Ibuprofen', dosage: '200mg', patientId: '102', description: 'Entzündungshemmend und schmerzlindernd', }
];

const mockNotifications = [
    {
        id: '1',
        title: 'Medikamentenerinnerung',
        message: 'Bitte nehmen Sie Ihre Medikamente um 08:00 Uhr ein.',
        isRead: false,
        createdAt: '2025-03-30T08:00:00Z'
    },
    {
        id: '2',
        title: 'Terminbestätigung',
        message: 'Ihr Termin bei Dr. Müller wurde bestätigt für den 01.04.2025 um 10:00 Uhr.',
        isRead: true,
        createdAt: '2025-03-28T14:15:00Z'
    }
];

const mockAppointments = [
    {
        id: '1',
        title: 'Hausarzttermin',
        description: 'Kontrolluntersuchung bei Dr. Müller',
        date: '2025-04-01',
        time: '10:00',
        location: 'Hausarztpraxis Müller, Sonnenweg 12',
        participants: ['Semih','niklas','metin']
    },
    {
        id: '2',
        title: 'Physiotherapie',
        description: 'Behandlung wegen Rückenschmerzen',
        date: '2025-04-03',
        time: '14:30',
        location: 'Therapiezentrum West, Bahnhofstraße 5',
        participants: ['Semih','niklas','metin']
    }
];

module.exports = {
    mockMedications,
    mockAppointments,
    mockNotifications
};
