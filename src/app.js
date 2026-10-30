// Entry Point Database
const express = require("express");
const helmet = require("helmet");
require("dotenv").config();

const connect = require("./config/database");
const {
  notFoundHandler,
  errorHandler,
} = require("./middlewares/error.middleware");
const { apiLimiter } = require("./middlewares/rate-limit.middleware");
const corsMiddleware = require("./middlewares/cors.middleware");
const bodyParser = require('body-parser')

const {
  swaggerUi,
  swaggerDocument,
  swaggerUiOptions,
} = require("./config/swagger");

const app = express();
app.use(
  helmet({
    contentSecurityPolicy: false, // Allow Swagger UI CDN scripts and styles
    crossOriginResourcePolicy: { policy: "cross-origin" },
  }),
);
// app.use(express.json({ limit: "10kb" }));
// app.use(express.urlencoded({ extended: true, limit: "10kb" }));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded())

// parse application/json
app.use(bodyParser.json())
app.use(corsMiddleware);

// Swagger Documentation UI & OpenAPI JSON Spec
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument, swaggerUiOptions)
);
app.get("/api-docs.json", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.send(swaggerDocument);
});

// Root route redirects to Swagger documentation
app.get("/", (req, res) => {
  res.redirect("/api-docs");
});

// import routes
const user_routes = require("./routes/user.route");
const category_routes = require("./routes/category.route");
const product_routes = require("./routes/product.route");
const supplier_routes = require("./routes/supplier.route");
const auth_routes = require("./routes/auth.route");
const file_routes = require("./routes/file.route");




app.use("/api", apiLimiter);
app.use("/api/users", user_routes);
app.use("/api/categories", category_routes);
app.use("/api/products", product_routes);
app.use("/api/suppliers", supplier_routes);
app.use("/api/auth", auth_routes);
app.use("/api/files", file_routes);

app.get("/health", async (req, res) => {
  try {
    const rows = await connect.query("SELECT 1 AS result");

    res.json({
      message: "API running!",
      database: rows[0].result === 1 ? "connected" : "unknown",
    });
  } catch (error) {
    res.status(500).json({
      message: "Database connection Failed",
    });
  }
});

app.use(notFoundHandler);
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`Server running at http://localhost:${PORT}`),
);
