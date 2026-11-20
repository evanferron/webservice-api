import Router from "@koa/router";
import { posts, generateId } from "./data.js";
import { fullSchema, patchSchema, querySchema } from "./schema.js";
import { validate, parseId, findIndexOr404 } from "./utils.js";

const router = new Router();

router.get("/posts", (ctx) => {
  const query = validate(querySchema, ctx.query);
  ctx.body = query.postId === undefined ? posts : posts.filter((p) => p.postId === query.postId);
});

router.get("/posts/:id", (ctx) => {
  const id = parseId(ctx);
  ctx.body = posts[findIndexOr404(ctx, id)];
});

router.post("/posts", (ctx) => {
  const data = validate(fullSchema, ctx.request.body);
  const post = { postId: data.postId, id: generateId(), name: data.name, email: data.email, body: data.body };
  posts.push(post);
  ctx.status = 201;
  ctx.set("Location", `/posts/${post.id}`);
  ctx.body = post;
});

router.put("/posts/:id", (ctx) => {
  const id = parseId(ctx);
  const data = validate(fullSchema, ctx.request.body);
  const index = findIndexOr404(ctx, id);
  posts[index] = { postId: data.postId, id, name: data.name, email: data.email, body: data.body };
  ctx.body = posts[index];
});

router.patch("/posts/:id", (ctx) => {
  const id = parseId(ctx);
  const data = validate(patchSchema, ctx.request.body);
  const index = findIndexOr404(ctx, id);
  posts[index] = { ...posts[index], ...data, id };
  ctx.body = posts[index];
});

router.delete("/posts/:id", (ctx) => {
  const id = parseId(ctx);
  const index = findIndexOr404(ctx, id);
  posts.splice(index, 1);
  ctx.status = 204;
});

export default router;
