/**
 * @file API main router
 * @author Sam DeCoursey <samdecoursey@ksu.edu>
 * @exports router an Express router
 *
 * @swagger
 * tags:
 *   name: api
 *   description: API routes
 */

// Import libraries
import express from "express";

// Import middleware
import tokenMiddleware from "../middlewares/token.js";

// Import v1 routers
import assetsRouter from "./api/v1/assets.js";
import transactionsRouter from "./api/v1/transactions.js";
import holdingsRouter from "./api/v1/holdings.js";
import reportsRouter from "./api/v1/reports.js";

// Import logger
import logger from "../configs/logger.js";

// Create Express router
const router = express.Router();

/**
 * Gets the list of API versions
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 *
 * @swagger
 * /api/:
 *   get:
 *     summary: list API versions
 *     tags: [api]
 *     responses:
 *       200:
 *         description: the list of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   version:
 *                     type: string
 *                   url:
 *                     type: string
 *             example:
 *               - version: "1.0"
 *                 url: /api/v1/
 */
router.get("/", function (req, res, next) {
  res.json([
    {
      version: "1.0",
      url: "/api/v1/",
    },
  ]);
});

router.get("/dexscreener/:chainId/:tokenAddresses", async (req, res) => {
  const { chainId, tokenAddresses } = req.params;

  try {
    const response = await fetch(
      `https://api.dexscreener.com/tokens/v1/${chainId}/${tokenAddresses}`,
      {
        method: "GET",
      },
    );
    const data = await response.json();
    res.json(data);
  } catch (error) {
    logger.error(error);
    res.status(500).end();
  }
});

// Use Token Middleware
router.use(tokenMiddleware);

// Use v1 routers
router.use("/v1/assets", assetsRouter);
router.use("/v1/transactions", transactionsRouter);
router.use("/v1/holdings", holdingsRouter);
router.use("/v1/reports", reportsRouter);

export default router;
