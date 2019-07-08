const fileNames = require('./-load-json');

module.exports = resourceName => Object.values(fileNames[resourceName]);
