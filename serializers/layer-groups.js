const JSONAPISerializer = require('jsonapi-serializer').Serializer;
const layerGroupSchema = require('../schemas/layer-group');
const layerSchema = require('../schemas/layer');
const sourceSchema = require('../schemas/source');

const { children: layerGroupAttrs } = layerGroupSchema.describe();
const { children: layerAttrs } = layerSchema.describe();
const { children: sourceAttrs } = sourceSchema.describe();

module.exports = (data, sources = []) => new JSONAPISerializer('layer-groups', {
  transform(record) {
    const mutatedRecord = record;
    mutatedRecord.sources = sources
      .filter(
        sourceObject => record.layers
          .map(({ style: { source } }) => source).includes(sourceObject.id),
      );

    return mutatedRecord;
  },
  attributes: Object.keys(layerGroupAttrs).concat('sources'),
  layers: {
    ref(parent, child) {
      return child.style.id;
    },
    included: true,
    attributes: Object.keys(layerAttrs),
  },
  sources: {
    ref(parent, child) {
      return child.id;
    },
    included: true,
    attributes: Object.keys(sourceAttrs),
  },
}).serialize(data);
