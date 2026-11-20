import Joi from "joi";

const fields = {
  postId: Joi.number().integer().min(1).strict(),
  name: Joi.string().trim().min(1).max(255),
  email: Joi.string().trim().email({ tlds: { allow: false } }).max(255),
  body: Joi.string().trim().min(1).max(10000),
};

// POST / PUT : tous les champs obligatoires, aucun champ inconnu (id compris)
export const fullSchema = Joi.object({
  postId: fields.postId.required(),
  name: fields.name.required(),
  email: fields.email.required(),
  body: fields.body.required(),
}).required();

// PATCH : au moins un champ, uniquement les champs modifiables
export const patchSchema = Joi.object(fields).min(1).required();

export const idSchema = Joi.number().integer().min(1);

export const querySchema = Joi.object({
  postId: Joi.number().integer().min(1),
});
