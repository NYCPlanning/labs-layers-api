const path = require('path');
const { sync: loadJsonFile } = require('load-json-file');
const fs = require('fs');

const availableResources = fs.readdirSync(
  path.resolve(__dirname, '../../data'),
);

const fileNames = availableResources.reduce((resourceCollections, resourceName) => {
  const resourceCollectionsMut = resourceCollections;

  const filesHash = fs.readdirSync(
    path.resolve(__dirname, `../../data/${resourceName}`),
  )
    .reduce((resourceValues, fileName) => {
      const resourceValuesMut = resourceValues;
      const identifier = fileName.split('.')[0];

      // generate a new object for this
      resourceValuesMut[identifier] = Object.assign(
        {},
        loadJsonFile(
          path.resolve(__dirname, `../../data/${resourceName}/${fileName}`),
        ),
      );

      return resourceValues;
    }, {});

  resourceCollectionsMut[resourceName] = filesHash;

  return resourceCollections;
}, {});

// exports a hash of resources keyed by resource name and identifier
module.exports = fileNames;
