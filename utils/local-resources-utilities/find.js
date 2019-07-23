// findOne(type, id)
const fileNames = require('./-load-json');

module.exports = (resourceName, identifier) => fileNames[resourceName][identifier];
