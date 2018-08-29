const Joi = require('joi');
const layerSchema = require('./layer');

const legendItemSchema = Joi.object().keys({
  label: Joi.string().required(),
  tooltip: Joi.string(),
  icon: Joi.object().keys({
    type: Joi.string().required(),
    layers: Joi.array(),
  }),
});

module.exports = Joi.object().keys({
  id: Joi.string().required(),
  visible: Joi.boolean(),
  legend: Joi.object().keys({
    label: Joi.string().required(),
    tooltip: Joi.string(),
    icon: Joi.object().keys({
      type: Joi.string().required(),
      layers: Joi.array(),
    }),
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
