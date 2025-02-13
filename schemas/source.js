const Joi = require('joi');

module.exports = Joi.object().keys({
  id: Joi.string().required(),
  type: Joi.valid(
    'vector',
    'raster',
    'geojson',
    'cartovector',
  ),
  data: Joi.object().when('type', {
    is: 'geojson',
    then: Joi.required()
  }),
  minzoom: Joi.number(),
  maxzoom: Joi.number(),
  'source-layers': Joi.array().items(Joi.object())
    .when('type', {
      is: 'cartovector',
      then: Joi.required(),
    }),
  tiles: Joi.array().items(Joi.string()).when('type', {
    is: 'raster',
    then: Joi.required(),
  }),
  tileSize: Joi.number().when('type', {
    is: 'raster',
    then: Joi.required(),
  }),
  buffersize: Joi.object().keys({
    mvt: Joi.number(),
  }),
  meta: Joi.object(),
});
