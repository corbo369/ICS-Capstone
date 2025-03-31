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
import helmet from "helmet";
import path from "path";
import swaggerUi from "swagger-ui-express";
import { fileURLToPath } from 'url';

// Import configurations
import logger from "./configs/logger.js";
import openapi from "./configs/openapi.js";

// Import middlewares
import requestLogger from "./middlewares/request-logger.js";

// Import routers
import apiRouter from "./routes/api.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create Express application
const app = express();

// Use libraries
app.use(cors({
  origin: '*',
}));
//app.use(helmet());
app.use(compression());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.json());

// Use middlewares
app.use(requestLogger);

// Use static files
app.use(express.static(path.resolve(__dirname, '../portfolio/dist')));

// Use routers
app.use("/api", apiRouter);

app.get("/api/dexscreener/:chainId/:tokenAddresses", async (req, res) => {
  const { chainId, tokenAddresses } = req.params;

  try {
    const response = await fetch(`https://api.dexscreener.com/tokens/v1/${chainId}/${tokenAddresses}`, {
      method: 'GET',
    });
    //Check error ?
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Error", error);
    res.status(500).json({ error: "Failed to fetch data" });
  }
})

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
