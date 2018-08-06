const Router = require('koa-router');
const buildLayerGroups = require('../../utils/build-layer-groups');

const router = new Router();

router.get('/', async (ctx) => {
  ctx.body = {
    status: 'success',
    message: 'hello, world!'
  };
})

router.post('/', async (ctx) => {
  const config = ctx.request.body;

  let response;
  try {
    response = await buildLayerGroups(config)
  } catch(e) {
    response = {
      errors: [e],
    }
  }

  ctx.body = response;
})



module.exports = router;
