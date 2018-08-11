const Router = require('koa-router');
const { findAll, where } = require('../../utils/local-resources-utilities');

const router = new Router();

router.get('/', async (ctx) => {
  // const config = ctx.request.query;
  // const { sources: ids } = config;

  const data = await findAll('sources');

  ctx.body = {
    data: data.map((resource) => {
      const { id } = resource;

      return {
        id,
        type: 'sources',
        attributes: resource,
      };
    }),
  };
});

router.post('/', async (ctx) => {
  const config = ctx.request.body;
  const { sources: ids } = config;

  const data = await where('sources', { id: ids });

  ctx.body = { data };
});

module.exports = router;
