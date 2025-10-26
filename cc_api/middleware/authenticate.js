const jwt = require('jsonwebtoken');

// Simple In-Memory-Blacklist für abgemeldete Tokens
const tokenBlacklist = new Set();

const authenticate = function(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Kein Token vorhanden' });
    }

    try {
        const token = authHeader.split(' ')[1];

        // Prüfen, ob Token in der Blacklist ist
        if (tokenBlacklist.has(token)) {
            return res.status(401).json({ error: 'Token wurde abgemeldet' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        console.error('Token-Validierungsfehler:', error.message);
        return res.status(403).json({ error: 'Ungültiger Token' });
    }
};

// Funktion zum Hinzufügen eines Tokens zur Blacklist (für Logout-Funktionalität)
authenticate.revokeToken = function(token) {
    tokenBlacklist.add(token);
};

module.exports = authenticate;