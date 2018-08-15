const Router = require('koa-router');
const shortid = require('shortid');
const { validate } = require('@mapbox/mapbox-gl-style-spec');

const router = new Router();

router.get('/:styleid', async (ctx) => {
  const { styleCache } = ctx.app;
  const { styleid } = ctx.params;
  const style = styleCache.get(styleid);

  ctx.body = style;
});

router.post('/', async (ctx) => {
  const { styleCache } = ctx.app;
  const style = ctx.request.body;

  // validate mapboxGL style
  const errors = validate(style);
  if (errors.length > 0) {
    ctx.response.status = 400;
    ctx.body = {
      errors,
    };
  } else {
    const styleid = shortid.generate();
    styleCache.set(styleid, style);

    ctx.body = {
      styleid,
    };
  }
});

module.exports = router;
