// findOne(type, id)
const path = require('path');
const loadJsonFile = require('load-json-file');

module.exports = (resourceName, { id: ids }) => {
  if (ids) {
    return ids.map(
      identifier => loadJsonFile(
        path.resolve(__dirname, `../../data/${resourceName}/${identifier}.json`),
      ),
    );
  }

  return new Error('Only querying by id is supported.');
};
