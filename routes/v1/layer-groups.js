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
  const { 'layer-groups': layerGroupIDs } = config;

  // get layerGroup configs from files...
  const promises = where('layer-groups', { id: layerGroupIDs });
  const layerGroupConfigs = await Promise.all(promises);

  let response;

  try {
    response = await buildMapboxStyle(layerGroupConfigs);
  } catch (e) {
    response = {
      errors: [e],
    };
  }

  ctx.body = response;
});

module.exports = router;
