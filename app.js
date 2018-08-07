const Koa = require('koa');
const cors = require('@koa/cors');
const bodyParser = require('koa-bodyparser');

const v1Routes = require('./routes/v1');

const app = new Koa();
app.use(bodyParser());
app.use(cors({
  origin: '*',
}));


app.use(v1Routes.routes());

app.listen(process.env.PORT || 3000);
