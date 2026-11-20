const MAX_BODY_BYTES = 1024 * 1024; // 1 Mo

// Gestion des erreurs : toujours une réponse JSON { error: "…" }
export const errorHandler = async (ctx, next) => {
  try {
    await next();
    // Réponses d'erreur sans corps (route inconnue, 405, …)
    if (ctx.status >= 400 && !ctx.body) {
      const status = ctx.status;
      ctx.body = { error: status === 404 ? "Route introuvable" : ctx.message };
      ctx.status = status; // affecter un corps repasse le statut à 200 : on le restaure
    }
  } catch (err) {
    const status = Number.isInteger(err.status) && err.status >= 400 && err.status < 600 ? err.status : 500;
    ctx.status = status;
    ctx.body = { error: status < 500 && err.expose !== false ? err.message : "Erreur interne du serveur" };
    if (status >= 500) console.error(err);
  }
};

// Temps de réponse + log
export const responseTime = async (ctx, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  ctx.set("X-Response-Time", `${ms}ms`);
  console.log(`${ctx.method} ${ctx.url} -> ${ctx.status} (${ms} ms)`);
};

// Lecture et parsing du corps JSON
export const jsonBody = async (ctx, next) => {
  if (["POST", "PUT", "PATCH"].includes(ctx.method)) {
    const chunks = [];
    let size = 0;
    for await (const chunk of ctx.req) {
      size += chunk.length;
      if (size > MAX_BODY_BYTES) ctx.throw(413, "Corps de requête trop volumineux");
      chunks.push(chunk);
    }
    const raw = Buffer.concat(chunks).toString("utf8");
    if (raw.trim() === "") {
      ctx.request.body = undefined;
    } else {
      try {
        ctx.request.body = JSON.parse(raw);
      } catch {
        ctx.throw(400, "JSON invalide");
      }
    }
  }
  await next();
};
