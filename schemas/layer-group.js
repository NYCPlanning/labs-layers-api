const Joi = require('joi');
const layerSchema = require('./layer');

const legendItemSchema = Joi.object().keys({
  label: Joi.string(),
  icon: Joi.object().keys({
    type: Joi.string(),
    options: Joi.object(),
  }),
  tooltip: Joi.string(),
});

module.exports = Joi.object().keys({
  id: Joi.string().required(),
  visible: Joi.boolean(),
  legend: Joi.object().keys({
    label: Joi.string(),
    icon: Joi.string(),
    tooltip: Joi.string(),
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
