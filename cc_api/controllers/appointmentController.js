// Alle Termine abrufen
exports.getAllAppointments = (req, res) => {
    res.json(global.mockAppointments);
};

// Einzelnen Termin nach ID abrufen
exports.getAppointmentById = (req, res) => {
    const id = req.params.id;
    const appointment = global.mockAppointments.find(a => a.id === id);

    if (!appointment) {
        return res.status(404).json({ message: 'Termin nicht gefunden' });
    }

    res.json(appointment);
};

// Ort eines Termins abrufen
exports.getAppointmentLocation = (req, res) => {
    const id = req.params.id;
    const appointment = global.mockAppointments.find(a => a.id === id);

    if (!appointment) {
        return res.status(404).json({ message: 'Termin nicht gefunden' });
    }

    res.json({ location: appointment.location });
};

// Teilnehmer des Termins (optional leer, da Mockdaten keine enthalten)
exports.getAppointmentParticipants = (req, res) => {
    const id = req.params.id;
    const appointment = global.mockAppointments.find(a => a.id === id);

    if (!appointment) {
        return res.status(404).json({ message: 'Termin nicht gefunden' });
    }

    res.json({ participants: appointment.participants });
};

// Termin erstellen
exports.createAppointment = (req, res) => {
    const newAppointment = {
        id: (global.mockAppointments.length + 1).toString(),
        ...req.body,
    };

    global.mockAppointments.push(newAppointment);
    res.status(201).json({ message: 'Termin erstellt', appointment: newAppointment });
};

// Termin aktualisieren
exports.updateAppointment = (req, res) => {
    const id = req.params.id;
    const appointment = global.mockAppointments.find(a => a.id === id);

    if (!appointment) {
        return res.status(404).json({ message: 'Termin nicht gefunden' });
    }

    Object.assign(appointment, req.body);
    res.json({ message: 'Termin aktualisiert', appointment });
};

// Termin löschen
exports.deleteAppointment = (req, res) => {
    const id = req.params.id;
    const index = global.mockAppointments.findIndex(a => a.id === id);

    if (index === -1) {
        return res.status(404).json({ message: 'Termin nicht gefunden' });
    }

    const deleted = global.mockAppointments.splice(index, 1);
    res.json({ message: 'Termin gelöscht', appointment: deleted[0] });
};
