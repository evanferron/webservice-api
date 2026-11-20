import { posts } from "./data.js";
import { idSchema } from "./schema.js";

export const validate = (schema, value) => {
  const { error, value: result } = schema.validate(value, {
    abortEarly: true,
    convert: true,
  });
  if (error) {
    const err = new Error(error.details[0].message);
    err.status = 400;
    err.expose = true;
    throw err;
  }
  return result;
};

export const parseId = (ctx) => {
  const { error, value } = idSchema.validate(ctx.params.id);
  if (error) ctx.throw(400, "L'id doit être un entier positif");
  return value;
};

export const findIndexOr404 = (ctx, id) => {
  const index = posts.findIndex((p) => p.id === id);
  if (index === -1) ctx.throw(404, `Post ${id} introuvable`);
  return index;
};
