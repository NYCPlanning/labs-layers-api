const carto = require('./carto');

module.exports = async (sourceConfig) => {
  const { id, type } = sourceConfig;

  if (type === 'cartovector') {
    // instantiate carto vector tiles, get back the tile template
    const template = await carto.getVectorTileTemplate(sourceConfig['source-layers']);

    // make an object with sourceid as a key, and valid mapboxGL source as value
    const source = {};
    source[id] = {
      type: 'vector',
      tiles: [template],
    };

    return source;
  }

  // make an object with sourceid as a key, and valid mapboxGL source as value
  const source = {};
  source[id] = {
    ...sourceConfig,
  };

  return source;
};
