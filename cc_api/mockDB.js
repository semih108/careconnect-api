// mockDB.js
// Password for all users: 123456
// Hashed with bcrypt rounds=10
const mockUsers = [
    {
        id: 1,
        name: 'Admin User',
        email: 'admin@careconnect.com',
        password: '$2b$10$u7oQ7ocVHzTXxYs/dBgc..EjckX8KjiCdTs7bgDKmK9UufYtnfiUy',
        phone: '+49 123 4567890',
        address: 'Main Street 1, 10115 Berlin',
        role: 'admin'
    },
    {
        id: 2,
        name: 'Pflegekraft Franz',
        email: 'franz@pflege.at',
        password: '$2b$10$u7oQ7ocVHzTXxYs/dBgc..EjckX8KjiCdTs7bgDKmK9UufYtnfiUy',
        phone: '+49 123 4567891',
        address: 'Care Way 5, 10115 Berlin',
        role: 'caregiver'
    },
    {
        id: 3,
        name: 'Oma Erna',
        email: 'erna@care.at',
        password: '$2b$10$u7oQ7ocVHzTXxYs/dBgc..EjckX8KjiCdTs7bgDKmK9UufYtnfiUy',
        phone: '+49 123 4567892',
        address: 'Senior Avenue 10, 10115 Berlin',
        role: 'patient'
    },
    {
        id: 4,
        name: 'Hans Enkel',
        email: 'hans@familie.at',
        password: '$2b$10$u7oQ7ocVHzTXxYs/dBgc..EjckX8KjiCdTs7bgDKmK9UufYtnfiUy',
        phone: '+49 123 4567893',
        address: 'Family Street 15, 10115 Berlin',
        role: 'relative'
    }
];

module.exports = {
    mockUsers
};
