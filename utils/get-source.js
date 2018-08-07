const carto = require('./carto');

const getSource = sourceId => new Promise(async (resolve, reject) => {
  // get sourceConfigs by id
  const sourceConfig = require(`../sources/${sourceId}.js`);

  const template = await carto.getVectorTileTemplate(sourceConfig['source-layers']);

  const source = {};

  source[sourceId] = {
    type: 'vector',
    tiles: [template],
  };

  resolve(source);
});

module.exports = getSource;
