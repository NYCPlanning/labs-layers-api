const Koa = require('koa');
const bodyParser = require('koa-bodyparser');

const v1Routes = require('./routes/v1');

const app = new Koa();
app.use(bodyParser());


app.use(v1Routes.routes());

app.listen(3000);
