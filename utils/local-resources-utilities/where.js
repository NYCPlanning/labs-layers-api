// findOne(type, id)
const fileNames = require('./-load-json');

module.exports = (resourceName, { id: ids }) => {
  if (ids) {
    return Promise.all(
      ids.map(
        identifier => fileNames[resourceName][identifier],
      ),
    );
  }

  return new Error('Only querying by id is supported.');
};
