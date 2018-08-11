const Joi = require('joi');

module.exports = Joi.object({
  style: Joi.object().required(),
  displayName: Joi.string(),
  before: Joi.string(),
  clickable: Joi.boolean(),
  highlightable: Joi.boolean(),
  tooltipable: Joi.boolean(),
  tooltipTemplate: Joi.string(),
});
