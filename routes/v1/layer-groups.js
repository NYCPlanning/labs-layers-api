const Router = require('koa-router');
const Joi = require('joi');
const merge = require('../../utils/deep-merge-with-array-replace');
const buildMapboxStyle = require('../../utils/build-mapbox-style');
const { where, findAll } = require('../../utils/local-resources-utilities');

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
  const { 'ids[]': ids } = ctx.request.query;

  let data;
  if (ids) {
    data = await where('layer-groups', { id: ids });
  } else {
    data = await findAll('layer-groups');
  }

  const meta = {
    mapboxStyle: await buildMapboxStyle(data),
  };

  data = data.map((resource) => {
    const { id } = resource;

    return {
      id,
      type: 'layer-groups',
      attributes: resource,
      relationships: {
        layers: {
          data: resource.layers.map((layer) => {
            const { style: { id: layerId } } = layer;

            return {
              id: layerId,
              type: 'layers',
            };
          }),
        },
      },
    };
  });

  ctx.body = {
    data,
    meta,
    included: data
      .map(({ attributes: { layers } }) => layers)
      .reduce((accumulator, current) => [...accumulator, ...current], [])
      .map((layer) => {
        const { style: { id } } = layer;

        return {
          id,
          type: 'layer',
          attributes: layer,
        };
      }),
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
