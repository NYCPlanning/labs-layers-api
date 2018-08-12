const JSONAPISerializer = require('jsonapi-serializer').Serializer;
const layerGroupSchema = require('../schemas/layer-group');
const layerSchema = require('../schemas/layer');

const { children: layerGroupAttrs } = layerGroupSchema.describe();
const { children: layerAttrs } = layerSchema.describe();

module.exports = data => new JSONAPISerializer('layer-groups', {
  attributes: Object.keys(layerGroupAttrs),
  layers: {
    ref(parent, child) {
      return child.style.id;
    },
    included: true,
    attributes: Object.keys(layerAttrs),
  },
}).serialize(data);
