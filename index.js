import Koa from "koa";
import Router from "@koa/router";

const app = new Koa();
const router = new Router();

const exemples = [
  {
    id: 1,
    text: "text 1",
    bool: true,
  },
  {
    id: 2,
    text: "text 2",
    bool: false,
  },
  {
    id: 3,
    text: "text 3",
    bool: true,
  },
  {
    id: 4,
    text: "text 4",
    bool: false,
  },
];

router.get("/", async (ctx) => {
  ctx.body = "Hello world";
});

router.get("/health", async (ctx) => {
  ctx.body = {
    status: "ok",
  };
});

router.get("/exemples/count", async (ctx) => {
  ctx.body = {
    count: exemples.length,
  };
});

router.get("/exemples", (ctx) => {
  const { bool } = ctx.query;
  console.log(bool);
  if (bool == undefined) {
    ctx.status = 400;
    ctx.body = {
      message: "bool param must be provided",
    };
    return;
  }
  let resExamples;
  if (bool) {
    console.log("test");
    resExamples = exemples.filter((e) => {
      return e.bool;
    });
  } else
    resExamples = exemples.filter((e) => {
      return !e.bool;
    });

  ctx.body = {
    examples: resExamples,
  };
});

router.get("/exemples/:id", (ctx) => {
  const {id} = ctx.params
  const res = exemples.find((e) => {
    return e.id == id
  })
  if (res == null) {
    ctx.status = 404
    ctx.body = {
      message: "not found"
    }
   return
  }
  ctx.body = {
    example: res
  }
})

// logger

app.use(async (ctx, next) => {
  await next();
  const rt = ctx.response.get("X-Response-Time");
  console.log(`${ctx.method} ${ctx.url} - ${rt}`);
});

// x-response-time

app.use(async (ctx, next) => {
  const start = Date.now();
  await next();
  console.log(
    `${ctx.method} ${ctx.path} -> ${ctx.status} (${Date.now() - start} ms)`,
  );
  const ms = Date.now() - start;
  ctx.set("X-Response-Time", `${ms}ms`);
});

// app.use((ctx) => {
//   ctx.body = {
//     method: ctx.method,
//     path: ctx.path,
//     query: ctx.query,
//     userAgent: ctx.get('User-Agent'),
//   }
// })

// app.use((ctx) => {
//   switch (ctx.path) {
//     case "/texte":
//       ctx.body = "Bonjour en texte";
//       break;
//     case "/json":
//       ctx.body = "Bonjour en JSON";
//       break;
//     case "/vide":
//       ctx.status = 204;
//       break;
//     case "/cree":
//       ctx.status = 201;
//       ctx.set("Location", "/examples/1");
//       ctx.body = { id: 1 };
//       break;
//   }
// });

app.use(router.routes());
app.use(router.allowedMethods());

app.listen(3000, () => {
  console.log("api lancé");
});
