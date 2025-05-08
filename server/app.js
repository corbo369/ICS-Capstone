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
import cors from "cors";
import express from "express";
import path from "path";
import swaggerUi from "swagger-ui-express";
import { fileURLToPath } from "url";

// Import configurations
import logger from "./configs/logger.js";
import openapi from "./configs/openapi.js";

// Import middlewares
import requestLogger from "./middlewares/request-logger.js";

// Import routers
import apiRouter from "./routes/api.js";
import authRouter from "./routes/auth.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create Express application
const app = express();

// Use libraries
app.use(cors({ origin: "*" }));
app.use(compression());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.json());

// Use middlewares
app.use(requestLogger);

// Use static files
app.use(express.static(path.resolve(__dirname, "../portfolio/dist")));

// Use routers
app.use("/api", apiRouter);

// Use auth routes
app.use("/auth", authRouter);

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
