const Joi = require('joi');

module.exports = Joi.object().keys({
  id: Joi.string().required(),
  title: Joi.string(),
  visible: Joi.boolean(),
  layerVisibilityType: Joi.string(),
  titleTooltip: Joi.string(),
  meta: Joi.object(),
  layers: Joi.array().items(
    Joi.object({
      style: Joi.object().required(),
      displayName: Joi.string(),
      before: Joi.string(),
      clickable: Joi.boolean(),
      highlightable: Joi.boolean(),
      tooltipable: Joi.boolean(),
      tooltipTemplate: Joi.string(),
    }),
  ),
  legendConfig: Joi.object(),
  legendIcon: Joi.string(),
  legendColor: Joi.string(),
});
