const { User } = require('../models');
const bcrypt = require('bcryptjs');

// Create new user (Admin only)
exports.createUser = async (req, res) => {
    try {
        const { name, email, password, phone, address, role } = req.body;

        // Validation
        if (!name || !email || !password || !role) {
            return res.status(400).json({ error: 'Name, E-Mail, Passwort und Rolle sind erforderlich' });
        }

        // Check if user already exists
        const existing = await User.findOne({ where: { email } });
        if (existing) {
            return res.status(409).json({ error: 'E-Mail bereits vergeben' });
        }

        // Validate role
        const validRoles = ['admin', 'caregiver', 'patient', 'relative'];
        if (!validRoles.includes(role)) {
            return res.status(400).json({ error: 'Ungültige Rolle. Erlaubt: admin, caregiver, patient, relative' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            phone,
            address,
            role
        });

        // Remove password from response
        const { password: _, ...userWithoutPassword } = user.dataValues;

        res.status(201).json({
            message: 'Benutzer erfolgreich erstellt',
            user: userWithoutPassword
        });

    } catch (err) {
        console.error('Error creating user:', err);
        res.status(500).json({ error: 'Interner Serverfehler beim Erstellen des Benutzers' });
    }
};

exports.getMyProfile = async (req, res) => {
    try {
        // Get user by ID from token
        const userId = req.user.id;
        const user = await User.findByPk(userId);
        
        if (!user) {
            return res.status(404).json({ error: 'Benutzer nicht gefunden' });
        }
        
        // Remove password from response and return clean JSON
        const { password, ...userWithoutPassword } = user.dataValues || user;
        res.json(userWithoutPassword);
    } catch (error) {
        console.error('Error fetching profile:', error);
        res.status(500).json({ error: 'Interner Serverfehler' });
    }
};

exports.updateMyProfile = (req, res) => res.send('Profil aktualisieren');
exports.getUserById = (req, res) => res.send('User abrufen');
exports.updateUserById = (req, res) => res.send('User aktualisieren');
exports.deleteUserById = (req, res) => res.send('User löschen');

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll();
        // Remove passwords from response and return clean JSON
        const usersWithoutPasswords = users.map(user => {
            const userData = user.dataValues || user;
            const { password, ...userWithoutPassword } = userData;
            return userWithoutPassword;
        });
        res.json(usersWithoutPasswords);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'Interner Serverfehler' });
    }
};

exports.getUsersByRole = (req, res) => res.send('User nach Rolle');
exports.getMyMedications = (req, res) => res.send('Eigene Medikamente');
exports.getMyAppointments = (req, res) => res.send('Eigene Termine');
exports.getPatientsOfCaregiver = (req, res) => res.send('Patienten dieses Pflegers');
exports.getRelativesOfPatient = (req, res) => res.send('Angehörige dieses Patienten');