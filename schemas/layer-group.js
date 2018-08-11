const Joi = require('joi');
const layerSchema = require('./layer');

module.exports = Joi.object().keys({
  id: Joi.string().required(),
  title: Joi.string(),
  visible: Joi.boolean(),
  layerVisibilityType: Joi.string(),
  titleTooltip: Joi.string(),
  meta: Joi.object(),
  layers: Joi.array().items(
    layerSchema,
  ),
  legendConfig: Joi.object(),
  legendIcon: Joi.string(),
  legendColor: Joi.string(),
});
