const Router = require('koa-router');
const buildMapboxStyle = require('../../utils/build-mapbox-style');
const { where } = require('../../utils/local-resources-utilities');

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

  const data = await where('layer-groups', { id: ids });
  const meta = {
    mapboxStyle: await buildMapboxStyle(data),
  };

  ctx.body = { data, meta };
});

module.exports = router;
