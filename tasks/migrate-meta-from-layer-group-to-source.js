const fs = require('fs');
const { findAll } = require('../utils/local-resources-utilities');

(async () => {
  const layerGroups = await findAll('layer-groups');
  const sources = await findAll('sources');

  layerGroups.forEach((layerGroup) => {
    const layerGroupMeta = layerGroup.meta;

    layerGroup.layers.forEach((layer) => {
      const matchingSource = sources.find(source => source.id === layer.style.source);
      if (matchingSource) matchingSource.meta = layerGroupMeta || {};
    });
  });

  sources.forEach((source) => {
    fs.writeFile(`./data/sources/${source.id}.json`, JSON.stringify(source, null, 2) + "\n", (err) => { // eslint-disable-line
      if (err) {
        return console.log(err);
      }

      console.log(source.id, ' has been saved');
    });
  });

  layerGroups.forEach((layerGroup) => {
    delete layerGroup.meta; // eslint-disable-line

    fs.writeFile(`./data/layer-groups/${layerGroup.id}.json`, JSON.stringify(layerGroup, null, 2) + "\n", (err) => { // eslint-disable-line
      if (err) {
        return console.log(err);
      }

      console.log(layerGroup.id, ' has been saved');
    });
  });
})();
