// Logic to use the correct environment's keys.
if (process.env.NODE_ENV === 'production') {
    // We are in the production environment, return the production keys.
    module.exports = require('./prod');
} else {
    // We are in development environment, return the dev keys.
    module.exports = require('./dev');
}
