const Router = require('koa-router');
const style = require('../../data/base/style.json');

const router = new Router();

const HOST = process.env.HOST || 'http://localhost:3000';

router.get('/style.json', async (ctx) => {
  style.sources.openmaptiles.url = style.sources.openmaptiles.url.replace('{{HOSTNAME}}', HOST);
  style.sprite = style.sprite.replace('{{HOSTNAME}}', HOST);

  ctx.body = style;
});

module.exports = router;
