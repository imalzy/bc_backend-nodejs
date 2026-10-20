function corsMiddleware(req, res, next) {
  const rawOrigins = process.env.CORS_ORIGIN || "*"; // ALL GET POST PUT PATCH DELETE
  const allowedOrigin = rawOrigins.split(",").map((o) => o.trim());
  const reqOrigin = req.header.origin;

  if (rawOrigins === "*") {
    res.setHeader("Access-Control-Allow-Origin", "*");
  } else if (reqOrigin && allowedOrigin.includes(reqOrigin)) {
    res.setHeader("Access-Control-Allow-Origin", reqOrigin);
    res.setHeader("Vary", "Origin");
  }

  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE, OPTIONS",
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, X-Requested-With, Accept",
  );
  res.setHeader("Access-Control-Max-Age", "86400"); // Cache preflight 24 jam

  // Handle Preflight Request
  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }
  next();
}

module.exports = corsMiddleware;
