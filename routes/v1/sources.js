const Router = require('koa-router');
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
  const { sources: ids } = config;

  const data = await where('sources', { id: ids });

  ctx.body = { data };
});

module.exports = router;
