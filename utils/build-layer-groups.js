const path = require('path');
const fetch = require('node-fetch');
const loadJsonFile = require('load-json-file');
const unique = require('array-unique');
const getSource = require('./get-source');

const buildLayerGroups = async config => new Promise(async (resolve, reject) => {
  const { 'layer-groups': layerGroups } = config;

  // get layergroup configs from files...
  const promises = layerGroups.map(layerGroup => loadJsonFile(path.resolve(__dirname, `../layer-groups/${layerGroup}.json`)));
  const layerGroupConfigs = await Promise.all(promises);

  const baseStyle = await fetch('https://raw.githubusercontent.com/NYCPlanning/labs-gl-style/master/data/style.json')
    .then(d => d.json());

  let layers = [];
  let sourceIds = [];

  layerGroupConfigs.forEach((layerGroupConfig) => {
    const internalLayers = layerGroupConfig.layers.map(d => d.layer);
    const internalSourceIds = internalLayers.map(d => d.source);
    layers = [...layers, ...internalLayers];
    sourceIds = [...sourceIds, ...internalSourceIds];
  });

  sourceIds = unique(sourceIds);

  baseStyle.layers = [...baseStyle.layers, ...layers];

  sourceIds.forEach(async (sourceId) => {
    console.log(sourceId)
    baseStyle.sources[sourceId] = await getSource(sourceId);
    console.log(baseStyle.sources)
  });

  const sourcePromises = sourceIds.map(sourceId => getSource(sourceId));

  const sources = await Promise.all(sourcePromises);

  console.log('resolving')
  resolve({
    meta: baseStyle,
  });
});

module.exports = buildLayerGroups;
