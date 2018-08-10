const path = require('path');
const loadJsonFile = require('load-json-file');
const fs = require('fs');

module.exports = (resourceName) => {
  const fileNames = fs.readdirSync(
    path.resolve(__dirname, `../../data/${resourceName}`),
  );

  return Promise.all(
    fileNames.map(
      fileName => loadJsonFile(
        path.resolve(__dirname, `../../data/${resourceName}/${fileName}`),
      ),
    ),
  );
};
