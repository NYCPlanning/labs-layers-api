const Router = require('koa-router');
const layerGroups = require('./layer-groups');
const sources = require('./sources');
const styleHost = require('./style-host');

const router = new Router();

router.use('/v1/layer-groups', layerGroups.routes());
router.use('/v1/sources', sources.routes());
router.use('/v1/style-host', styleHost.routes());

router.get('/v1', async (ctx) => {
  ctx.body = {
    status: 'v1 is working',
  };
});

module.exports = router;
