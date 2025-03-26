/**
 * @file Main Express application
 * @author Sam DeCoursey <samdecoursey@ksu.edu>
 * @exports app Express application
 */

// Load environment (must be first)
import "@dotenvx/dotenvx/config";

// Import libraries
import compression from "compression";
import cookieParser from "cookie-parser";
import express from "express";
import helmet from "helmet";
import path from "path";
import swaggerUi from "swagger-ui-express";

// Import configurations
import logger from "./configs/logger.js";
import openapi from "./configs/openapi.js";

// Import middlewares
import requestLogger from "./middlewares/request-logger.js";

// Import routers
import indexRouter from "./routes/index.js";
import usersRouter from "./routes/users.js";

// Create Express application
var app = express();

// Use libraries
app.use(helmet());
app.use(compression());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.json());

// Use middlewares
app.use(requestLogger);

// Use static files
app.use(express.static(path.join(import.meta.dirname, "public")));

// Use routers
app.use("/", indexRouter);
app.use("/users", usersRouter);

// Use SwaggerJSDoc router if enabled
if (process.env.OPENAPI_VISIBLE === "true") {
  logger.warn("OpenAPI documentation visible!");
  app.use(
    "/docs",
    swaggerUi.serve,
    swaggerUi.setup(openapi, { explorer: true }),
  );
}

export default app;
