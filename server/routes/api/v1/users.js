/**
 * @file Users router
 * @author Sam DeCoursey <samdecoursey@ksu.edu>
 * @exports router an Express router
 *
 * @swagger
 * tags:
 *   name: users
 *   description: Users Routes
 */

// Import libraries
import express from "express";

// Create Express router
const router = express.Router();

// Import Database
import database from "../../../configs/database.js";

// Import logger
import logger from "../../../configs/logger.js";

/**
 * Gets the list of Users
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 *
 * @swagger
 * /api/v1/users:
 *   get:
 *     summary: users list page
 *     description: Gets the list of all users in the application
 *     tags: [users]
 *     responses:
 *       200:
 *         description: the list of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 */
router.get("/", async function (req, res, next) {
  try {
    const users = await database.query("SELECT * FROM Users");
    res.json(users[0]);
  } catch (error) {
    logger.error(error);
    res.status(500).end();
  }
});

export default router;
