const unique = require('array-unique');
const { where } = require('./local-resources-utilities');
const structureCartoSource = require('./structure-carto-source');
const structureRegularSources = require('./structure-regular-source');
const baseStyle = require('../data/base/style.json');

const HOST = process.env.HOST || 'http://localhost:3000';
baseStyle.sources.openmaptiles.url = baseStyle.sources.openmaptiles.url.replace('{{HOSTNAME}}', HOST);
baseStyle.sprite = baseStyle.sprite.replace('{{HOSTNAME}}', HOST);

module.exports = async (layerGroups) => {
  // import the base style and replace the HOSTNAME with the current environment

  // iterate over configs, pull out the layers and all required source ids
  let layers = [];
  let sourceIds = [];

  layerGroups.forEach((layerGroupConfig) => {
    const { id } = layerGroupConfig;
    const internalLayers = layerGroupConfig.layers.map((d) => {
      const { style } = d;

      // set metadata to tie layer to layergroup
      style.metadata = {
        'nycplanninglabs:layergroupid': id,
      };

      // // set initial visibility to match visible property of layergroup
      // style.visibility = layerGroupVisible ? 'visible' : 'none';

      return style;
    });
    const internalSourceIds = internalLayers.map(d => d.source);
    layers = [...layers, ...internalLayers];
    sourceIds = [...sourceIds, ...internalSourceIds];
  });

  // add all layers to the baseStyle
  // TODO use the order of the layers specified in the config to determine the correct order
  // TODO set visibility for each layer
  // TODO insert before labels
  // WHAT WAS THIS?!
  // baseStyle.layers = [...baseStyle.layers, ...layers];

  // de-dupe source ids, many layers may require the same source
  // some layergroups reference the source 'openmaptiles' which is already added to the base style
  sourceIds = unique(sourceIds).filter(d => d !== 'openmaptiles');

  // get sources for each id
  const sources = await where('sources', { id: sourceIds });

  // these must happen in the aggregate in order to round up everything
  // into a single request
  const sourcesWithCarto = await structureCartoSource(sources);

  const structuredSources = await Promise.all(
    sourcesWithCarto.map(
      source => structureRegularSources(source),
    ),
  );

  // add all sources to the base style
  structuredSources
    .forEach((source) => {
      baseStyle.sources = {
        ...baseStyle.sources,
        ...source,
      };
    });

  // Delete invalid id key from geojson sources in
  // meta.mapboxStyle.sources entries
  Object.entries(baseStyle.sources).forEach(([key, _source]) => {
    const source = Object.assign({}, _source);
    if (source.type === 'geojson') {
      delete source.id;
      baseStyle.sources[key] = source;
    }
  });

  return baseStyle;
};
