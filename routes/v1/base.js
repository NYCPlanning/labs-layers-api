const Router = require('koa-router');
const style = require('../../data/base/style.json');

const router = new Router();

const BASEMAP_URL = process.env.BASEMAP_URL || 'https://staging.tiles.planninglabs.nyc';
const HOST = process.env.HOST || 'http://localhost:3000';

router.get('/style.json', async (ctx) => {
  style.sources.openmaptiles.url = style.sources.openmaptiles.url.replace('{{BASEMAP_URL}}', BASEMAP_URL);
  style.sprite = style.sprite.replace('{{HOSTNAME}}', HOST);
  style.glyphs = style.glyphs.replace('{{BASEMAP_URL}}', BASEMAP_URL);

  ctx.body = style;
});

module.exports = router;
