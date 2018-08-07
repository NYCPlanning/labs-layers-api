const Router = require('koa-router');
const buildMapboxStyle = require('../../utils/build-mapbox-style');
const { where } = require('../../utils/local-resources-utilities');
// const findAll = require('../../utils/local-resources-utilities/find-all');

const router = new Router();

router.get('/', async (ctx) => {
  ctx.body = {
    status: 'success',
    message: 'hello, world!',
  };
});

router.post('/', async (ctx) => {
  const config = ctx.request.body;
  const { 'layer-groups': ids } = config;

  // get layerGroup configs from files...
  const data = await where('layer-groups', { id: ids });
  const meta = {
    mapboxStyle: await buildMapboxStyle(data),
  };

  let response;

  try {
    response = { data, meta };
  } catch (e) {
    response = {
      errors: [e],
    };
  }

  ctx.body = response;
});

module.exports = router;
