const Router = require('koa-router');
const { sync: loadJsonFile } = require('load-json-file');
const path = require('path');
const router = new Router();
const HOST = process.env.HOST || 'http://localhost:3000';

router.get('/style.json', async (ctx) => {
  const style = loadJsonFile(
    path.resolve(__dirname, `../../data/base/style.json`),
  );

  style.sources.openmaptiles.url = style.sources.openmaptiles.url.replace('{{HOSTNAME}}', HOST);
  style.sprite = style.sprite.replace('{{HOSTNAME}}', HOST);

  ctx.body = style;
});

module.exports = router;
