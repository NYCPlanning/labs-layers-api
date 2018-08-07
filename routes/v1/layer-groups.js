const Router = require('koa-router');
const buildMapboxStyle = require('../../utils/build-mapbox-style');
const find = require('../../utils/local-resources-utilities/find');
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
  const { 'layer-groups': layerGroups } = config;

  // get layerGroup configs from files...
  const promises = layerGroups
    .map(layerGroupID => find('layer-groups', layerGroupID));

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
