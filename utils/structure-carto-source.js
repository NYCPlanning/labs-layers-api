const carto = require('./carto');

module.exports = async (sourceConfigs) => {
  const cartoVectorSourceLayers = sourceConfigs
    .filter(({ type }) => type === 'cartovector')
    .map(({ 'source-layers': sourceLayers }) => sourceLayers)
    // flatten the array
    .reduce((acc, curr) => [...curr, ...acc], []);

  const anonymousMapTiles = await carto.getVectorTileTemplate({
    'source-layers': cartoVectorSourceLayers,
  });

  return sourceConfigs.map((source) => {
    if (source.type !== 'cartovector') return source;

    const { layergroupid } = anonymousMapTiles;
    const { layers } = anonymousMapTiles.metadata;
    const sourceLayerIds = source['source-layers'].map(sourceLayer => sourceLayer.id);
    const baseUrl = `https://${carto.cartoDomain}/api/v1/map`;
    const ids = layers
      .filter(tile => sourceLayerIds.includes(tile.id))
      .map(layer => layer.id)
      // find the indices of set intersections of layer ids
      .map(layerId => layers.map(layer => layer.id).indexOf(layerId))
      .join();


    return {
      ...source,
      type: 'vector',
      tiles: [`${baseUrl}/${layergroupid}/${ids}/{z}/{x}/{y}.mvt`],
    };
  });
};
