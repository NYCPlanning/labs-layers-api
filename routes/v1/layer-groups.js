const Router = require('koa-router');
const Joi = require('joi');
const merge = require('../../utils/deep-merge-with-array-replace');
const buildMapboxStyle = require('../../utils/build-mapbox-style');
const { where } = require('../../utils/local-resources-utilities');

const router = new Router();

const querySchema = Joi.object().keys({
  'layer-groups': Joi.array().items(
    Joi.string(),
    Joi.object().keys({
      id: Joi.string().required(),
      title: Joi.string(),
      visible: Joi.boolean(),
      titleTooltip: Joi.string(),
      meta: Joi.object(),
      layers: Joi.array().items(Joi.object()),
    }),
  ),
});

router.get('/', async (ctx) => {
  ctx.body = {
    status: 'success',
    message: 'hello, world!',
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

  const meta = {
    mapboxStyle: await buildMapboxStyle(data),
  };

  ctx.body = { data, meta };
});

module.exports = router;
