const { Medication } = require('../models');


exports.getAllMedications = (req, res) => {
    res.json(global.mockMedications);
}

exports.getMedicationById = (req, res) => {
    const id = req.params.id;
    const med = global.mockMedications.find(m => m.id === id);

    if (!med) {
        return res.status(404).json({message: 'Medikament nicht gefunden'})
    }

    res.status(200).json(med);
}

exports.addMedication = (req, res) => {
    const { name, dosage, patientId, description } = req.body;

    if (!name || !dosage || !patientId) {
        return res.status(400).json({ message: 'Name, Dosierung und PatientId erforderlich' });
    }

    const newMed = {
        id: (global.mockMedications.length + 1).toString(),
        name,
        dosage,
        patientId,
        description,
    };

    global.mockMedications.push(newMed);
    res.status(201).json(newMed);
};

exports.updateMedication = (req, res) => {
    const id = req.params.id;
    const med = global.mockMedications.find(m => m.id === id);

    if (!med) {
        return res.status(404).json({ message: 'Medikament nicht gefunden' });
    }

    const { name, dosage, patientId, description } = req.body;
    if (name) med.name = name;
    if (dosage) med.dosage = dosage;
    if (patientId) med.patientId = patientId;
    if (description) med.description = description;

    res.json(med);
};

exports.deleteMedication = (req, res) => {
    const id = req.params.id;
    const index = global.mockMedications.findIndex(m => m.id === id);

    if (index === -1) {
        return res.status(404).json({ message: 'Medikament nicht gefunden' });
    }

    const deleted = global.mockMedications.splice(index, 1);
    res.json({ message: 'Medikament gelöscht', deleted: deleted[0] });
};

exports.getMedicationsOfPatient = (req, res) => {
    const patientId = req.params.id;
    const meds = global.mockMedications.filter(m => m.patientId === patientId);

    if (!meds) {
        return res.status(404).json({ message: 'Keine Medikamente für diesen Patienten gefunden' });
    }
    res.status(200).json(meds);
};
