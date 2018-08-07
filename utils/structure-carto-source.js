const carto = require('./carto');

const getSource = sourceConfig => new Promise(async (resolve, reject) => {
  try {
    // instantiate carto vector tiles, get back the tile template
    const template = await carto.getVectorTileTemplate(sourceConfig['source-layers']);

    // make an object with sourceid as a key, and valid mapboxGL source as value
    const source = {};
    source[sourceConfig.id] = {
      type: 'vector',
      tiles: [template],
    };

    resolve(source);
  } catch (e) {
    reject(e);
  }
});

module.exports = getSource;
