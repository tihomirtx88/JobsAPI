const { BadRequestError } = require("./../errors/bad-request"); 

const testUser = (req, res, next) => {
    if (req.user.testUser) {
        throw new BadRequestError('Test User! Read only!');
    }
};

module.exports = testUser;