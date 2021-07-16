const Joi = require('joi');
const layerSchema = require('./layer');

const legendIconSchema = Joi.object().keys({
  type: Joi.string().valid(
    'line',
    'rectangle',
    'fa-icon',
  ).required(),
  layers: Joi.when('type', {
    is: 'fa-icon',
    then: Joi.array().items(
      Joi.object().keys({
        'fa-icon': Joi.string().required(),
      }).unknown(),
    ),
    otherwise: Joi.array().items(Joi.object()),
  }),
});

const legendItemSchema = Joi.object().keys({
  label: Joi.string().required(),
  tooltip: Joi.string(),
  icon: legendIconSchema,
});

module.exports = Joi.object().keys({
  id: Joi.string().required(),
  visible: Joi.boolean(),
  filter: Joi.array(),
  title: Joi.string(),
  titleTooltip: Joi.string(),
  legend: Joi.object().keys({
    label: Joi.string().required(),
    tooltip: Joi.string(),
    infolink: Joi.string(),
    icon: legendIconSchema,
    items: Joi.array().items(
      legendItemSchema,
    ),
  }),
  layerVisibilityType: Joi.string(),

  meta: Joi.object(),
  layers: Joi.array().items(
    layerSchema,
  ),
  legendConfig: Joi.object(),
  legendIcon: Joi.string(),
  legendColor: Joi.string(),
});
