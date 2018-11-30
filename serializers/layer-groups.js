const JSONAPISerializer = require('jsonapi-serializer').Serializer;
const merge = require('deepmerge');
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

    // delegate explicitly-set "visible" state to related layers
    mutatedRecord.layers = mutatedRecord.layers
      .map((layer) => {
        const mutatedLayer = layer;

        // check if only true or false to avoid delegation
        if (mutatedRecord.visible === true || mutatedRecord.visible === false) {
          mutatedLayer.style = merge(mutatedLayer.style, {
            layout: {
              visibility: (mutatedRecord.visible === true) ? 'visible' : 'none',
            },
          });
        }

        return mutatedLayer;
      });

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
