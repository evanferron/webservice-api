const Koa = require('koa');
const app = new Koa();

// logger

app.use(async (ctx, next) => {
  await next();
  const rt = ctx.response.get('X-Response-Time');
  console.log(`${ctx.method} ${ctx.url} - ${rt}`);
});

// x-response-time

app.use(async (ctx, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  ctx.set('X-Response-Time', `${ms}ms`);
});

app.use(async (ctx, next) => {
  const debut = Date.now()
  await next()
  console.log(`${ctx.method} ${ctx.path} -> ${ctx.status} (${Date.now() - debut} ms)`)
})

// app.use((ctx) => {
//   ctx.body = {
//     method: ctx.method,
//     path: ctx.path,
//     query: ctx.query,
//     userAgent: ctx.get('User-Agent'),
//   }
// })

app.use((ctx) => {
  if (ctx.path === '/texte') {
    ctx.body = 'Bonjour en texte'
  } else if (ctx.path === '/json') {
    ctx.body = { message: 'Bonjour en JSON' }
  } else if (ctx.path === '/vide') {
    ctx.status = 204
  } else if (ctx.path === '/cree') {
    ctx.status = 201
    ctx.set('Location', '/examples/1')
    ctx.body = { id: 1 }
  }
})

app.listen(3000);

console.log("api lancé")
