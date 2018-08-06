const Router = require('koa-router');
const layerGroups = require('./layer-groups');

const router = new Router();

router.use('/v1/layer-groups', layerGroups.routes());

router.get('/v1', async (ctx) => {
  ctx.body = {
    status: 'v1 is working',
  };
})

module.exports = router;
