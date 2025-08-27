const bcrypt = require('bcryptjs');

function hashPassword(password) {
    return bcrypt.hashSync(password, 10);
}

function comparePassword(input, hashed) {
    return bcrypt.compareSync(input, hashed);
}

module.exports = { hashPassword, comparePassword };