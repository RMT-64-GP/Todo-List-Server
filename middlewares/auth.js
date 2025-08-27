const { verifyToken } = require('../helpers/jwt');
const { User } = require('../models');

async function authentication(req, res, next) {
    try {
        const { authorization } = req.headers;
        if (!authorization) throw { name: 'Unauthenticated' };

        const payload = verifyToken(authorization);
        const user = await User.findByPk(payload.id);

        if (!user) throw { name: 'Unauthenticated' };

        req.user = {
            id: user.id,
            email: user.email,
            role: user.role
        };

        next();
    } catch (err) {
        next(err);
    }
}

function authorizationAdmin(req, res, next) {
    try {
        if (req.user.role !== 'admin') throw { name: 'Forbidden' };
        next();
    } catch (err) {
        next(err);
    }
}

module.exports = {
    authentication,
    authorizationAdmin
};