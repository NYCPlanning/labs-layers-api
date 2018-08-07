// findOne(type, id)
const path = require('path');
const loadJsonFile = require('load-json-file');

module.exports = (resourceName, identifier) => loadJsonFile(
  path.resolve(__dirname, `../data/${resourceName}/${identifier}.json`),
);
