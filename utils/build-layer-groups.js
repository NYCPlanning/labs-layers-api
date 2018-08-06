const path = require('path');
const loadJsonFile = require('load-json-file');

const buildLayerGroups = async (config) => {


  return new Promise(async (resolve, reject) => {
    const { 'layer-groups':layerGroups } = config;

    // get layergroup configs from files...
    const promises = layerGroups.map(layerGroup => loadJsonFile(path.resolve(__dirname, `../layer-groups/${layerGroup}.json`)));
    const layerGroupConfigs = await Promise.all(promises);

    let layers = [];



    layerGroupConfigs.forEach((config) => {
      const internalLayers = config.layers.map(d => d.layer);
      layers = [...layers, ...internalLayers]
    })

    resolve({
      meta: layers
    })
  })
}

module.exports = buildLayerGroups
