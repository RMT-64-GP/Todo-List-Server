module.exports = {
    adminOnly(req, res, next) {
        try {
            if (!req.user) {
                throw { name: 'Unauthorized', message: 'User data not found' }
            }

            if (req.user.role !== 'admin') {
                throw { name: 'Forbidden', message: 'You are not authorized to access this resource' }
            }

            next()
        } catch (error) {
            next(error)
        }
    }
};