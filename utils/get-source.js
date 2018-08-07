const carto = require('./carto');

const getSource = sourceId => new Promise(async (resolve, reject) => {
  // import sourceConfig
  const sourceConfig = require(`../sources/${sourceId}.js`); // eslint-disable-line

  try {
    // instantiate carto vector tiles, get back the tile template
    const template = await carto.getVectorTileTemplate(sourceConfig['source-layers']);

    // make an object with sourceid as a key, and valid mapboxGL source as value
    const source = {};
    source[sourceId] = {
      type: 'vector',
      tiles: [template],
    };

    resolve(source);
  } catch (e) {
    reject(e);
  }
});

module.exports = getSource;
