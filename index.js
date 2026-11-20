import Koa from "koa";
import router from "./routes.js";
import { errorHandler, responseTime, jsonBody } from "./middlewares.js";

const app = new Koa();

app.use(errorHandler);
app.use(responseTime);
app.use(jsonBody);

app.use(router.routes());
app.use(router.allowedMethods());

const PORT = process.env.PORT ?? 3000;

app.listen(PORT, () => {
  console.log(`api lancé sur http://localhost:${PORT}`);
});
