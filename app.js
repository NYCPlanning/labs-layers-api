// 
require('newrelic');

const Koa = require('koa');
const cors = require('@koa/cors');
const bodyParser = require('koa-bodyparser');
const serve = require('koa-static');

const v1Routes = require('./routes/v1');

const app = new Koa();

// Configure Sentry
const Sentry = require('@sentry/node');
Sentry.init({ dsn: process.env.SENTRY_DSN });
app.on('error', (err, ctx) => {
  Sentry.withScope(scope => {
    scope.addEventProcessor(event => Sentry.Handlers.parseRequest(event, ctx.request));
    Sentry.captureException(err);
  });
});

app.use(bodyParser());
app.use(cors({
  origin: '*',
}));
app.use(serve('public'));

// better error handling
app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    console.log(err);

    ctx.status = err.status || 500;
    ctx.body = { errors: [err] };
    ctx.app.emit('error', err, ctx);
  }
});

app.use(v1Routes.routes());

module.exports = app.listen(process.env.PORT || 3000);
