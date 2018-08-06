const path = require('path');
const fetch = require('node-fetch');
const loadJsonFile = require('load-json-file');

const buildLayerGroups = async (config) => {


  return new Promise(async (resolve, reject) => {
    const { 'layer-groups':layerGroups } = config;

    // get layergroup configs from files...
    const promises = layerGroups.map(layerGroup => loadJsonFile(path.resolve(__dirname, `../layer-groups/${layerGroup}.json`)));
    const layerGroupConfigs = await Promise.all(promises);

    const baseStyle = await fetch('https://raw.githubusercontent.com/NYCPlanning/labs-gl-style/master/data/style.json')
      .then(d => d.json());

    let layers = [];

    layerGroupConfigs.forEach((config) => {
      const internalLayers = config.layers.map(d => d.layer);
      layers = [...layers, ...internalLayers]
    })

    baseStyle.layers = [...baseStyle.layers, ...layers]

    resolve({
      meta: baseStyle
    })
  })
}

module.exports = buildLayerGroups
