const JSONAPISerializer = require('jsonapi-serializer').Serializer;

module.exports = data => new JSONAPISerializer('layer-groups', {
  attributes: ['title', 'visible', 'layerVisibilityType', 'titleTooltip', 'meta', 'layers', 'legendConfig', 'legendIcon', 'legendColor'],
  layers: {
    ref(parent, child) {
      return child.style.id;
    },
    included: true,
    attributes: ['style', 'displayName', 'before', 'clickable', 'highlightable', 'tooltipable', 'tooltipTemplate'],
  },
}).serialize(data);
