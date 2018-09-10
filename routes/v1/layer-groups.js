const Router = require('koa-router');
const Joi = require('joi');
const layerGroupSerializer = require('../../serializers/layer-groups');
const layerGroupSchema = require('../../schemas/layer-group');
const merge = require('../../utils/deep-merge-with-array-replace');
const buildMapboxStyle = require('../../utils/build-mapbox-style');
const { where, findAll } = require('../../utils/local-resources-utilities');

const router = new Router();

const querySchema = Joi.object().keys({
  'layer-groups': Joi.array().items(
    Joi.string(),
    layerGroupSchema,
  ),
});

router.get('/', async (ctx) => {
  const { 'ids[]': ids } = ctx.request.query;

  let data;

  if (ids) {
    data = await where('layer-groups', { id: ids });
  } else {
    data = await findAll('layer-groups');
  }

  const sources = await findAll('sources');

  ctx.body = {
    ...layerGroupSerializer(data, sources),
    meta: {
      mapboxStyle: await buildMapboxStyle(data),
    },
  };
});

router.post('/', async (ctx) => {
  const config = ctx.request.body;
  const { value: { 'layer-groups': query } } = querySchema.validate(config);

  let data = {};

  // ids only
  if (query.every(element => typeof element === 'string')) {
    data = await where('layer-groups', { id: query });
  }

  // objects
  if (query.every(element => typeof element === 'object')) {
    const originalObjects = await where('layer-groups', { id: query.map(({ id }) => id) });
    data = merge(originalObjects, query);
  }

  ctx.body = {
    ...layerGroupSerializer(data),
    meta: {
      mapboxStyle: await buildMapboxStyle(data),
    },
  };
});

module.exports = router;
