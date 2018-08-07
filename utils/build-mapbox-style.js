const fetch = require('node-fetch');
const unique = require('array-unique');
const { where } = require('./local-resources-utilities');
const structureCartoSource = require('./structure-carto-source');

const buildLayerGroups = layerGroups => new Promise(async (resolve, reject) => {
  try {
    // import the base style from labs-gl-style repo on github
    const baseStyle = await fetch('https://raw.githubusercontent.com/NYCPlanning/labs-gl-style/master/data/style.json')
      .then(d => d.json());

    // iterate over configs, pull out the layers and all required source ids
    let layers = [];
    let sourceIds = [];

    layerGroups.forEach((layerGroupConfig) => {
      const internalLayers = layerGroupConfig.layers.map(d => d.layer);
      const internalSourceIds = internalLayers.map(d => d.source);
      layers = [...layers, ...internalLayers];
      sourceIds = [...sourceIds, ...internalSourceIds];
    });

    // add all layers to the baseStyle
    // TODO use the order of the layers specified in the config to determine the correct order
    // TODO set visibility for each layer
    // TODO insert before labels
    baseStyle.layers = [...baseStyle.layers, ...layers];

    // de-dupe source ids, many layers may require the same source
    sourceIds = unique(sourceIds);

    // get sources for each id
    const sources = await where('sources', { id: sourceIds });
    const structuredSources = await Promise.all(
      sources.map(
        source => structureCartoSource(source),
      ),
    );

    // add all sources to the base style
    structuredSources
      .forEach(async (source) => {
        baseStyle.sources = {
          ...baseStyle.sources,
          ...source,
        };
      });

    resolve({
      meta: baseStyle,
    });
  } catch (e) {
    reject(e);
  }
});

module.exports = buildLayerGroups;
