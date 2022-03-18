require('dotenv').config()
const Koa = require('koa');
const cors = require('@koa/cors');
const bodyParser = require('koa-bodyparser');
const serve = require('koa-static');

const v1Routes = require('./routes/v1');

const app = new Koa();
const domain = require("domain");

const {
  extractTraceparentData,
  stripUrlQueryAndFragment,
} = require("@sentry/tracing");

// Configure Sentry
const Sentry = require('@sentry/node');

Sentry.init({ dsn: process.env.SENTRY_DSN });

// not mandatory, but adding domains does help a lot with breadcrumbs
const requestHandler = (ctx, next) => {
  return new Promise((resolve, _) => {
    const local = domain.create();
    local.add(ctx);
    local.on("error", err => {
      ctx.status = err.status || 500;
      ctx.body = err.message;
      ctx.app.emit("error", err, ctx);
    });
    local.run(async () => {
      Sentry.getCurrentHub().configureScope(scope =>
        scope.addEventProcessor(event =>
          Sentry.Handlers.parseRequest(event, ctx.request, { user: false })
        )
      );
      await next();
      resolve();
    });
  });
};

// this tracing middleware creates a transaction per request
const tracingMiddleWare = async (ctx, next) => {
  const reqMethod = (ctx.method || "").toUpperCase();
  const reqUrl = ctx.url && stripUrlQueryAndFragment(ctx.url);

  // connect to trace of upstream app
  let traceparentData;
  if (ctx.request.get("sentry-trace")) {
    traceparentData = extractTraceparentData(ctx.request.get("sentry-trace"));
  }

  const transaction = Sentry.startTransaction({
    name: `${reqMethod} ${reqUrl}`,
    op: "http.server",
    ...traceparentData,
  });

  ctx.__sentry_transaction = transaction;
  
  // We put the transaction on the scope so users can attach children to it
  Sentry.getCurrentHub().configureScope(scope => {
    scope.setSpan(transaction);
  });

  ctx.res.on("finish", () => {
    // Push `transaction.finish` to the next event loop so open spans have a chance to finish before the transaction closes
    setImmediate(() => {
      // if using koa router, a nicer way to capture transaction using the matched route
      if (ctx._matchedRoute) {
        const mountPath = ctx.mountPath || "";
        transaction.setName(`${reqMethod} ${mountPath}${ctx._matchedRoute}`);
      }
      transaction.setHttpStatus(ctx.status);
      transaction.finish();
    });
  });

  await next();
};

app.use(requestHandler);
app.use(tracingMiddleWare);

app.on("error", (err, ctx) => {
  Sentry.withScope((scope) => {
    scope.addEventProcessor((event) => {
      return Sentry.Handlers.parseRequest(event, ctx.request);
    });
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
