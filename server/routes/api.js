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

// Import v1 routers
import usersRouter from "./api/v1/users.js";
import transactionsRouter from "./api/v1/transactions.js"

// Create Express router
const router = express.Router();

// Use v1 routers
router.use("/v1/users", usersRouter);
router.use("/v1/transactions", transactionsRouter);

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
router.get('/', function (req, res, next) {
  res.json([
    {
      version: "1.0",
      url: "/api/v1/"
    }
  ])
})

export default router