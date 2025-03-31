/**
 * @file Transactions router
 * @author Sam DeCoursey <samdecoursey@ksu.edu>
 * @exports router an Express router
 *
 * @swagger
 * tags:
 *   name: transactions
 *   description: Transactions Routes
 */

// Import libraries
import express from "express";

// Create Express router
const router = express.Router();

// Import models
import { Transaction } from "../../../models/models.js";

// Import logger
import logger from "../../../configs/logger.js";

/**
 * Gets the list of transactions
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 *
 * @swagger
 * /api/v1/transactions:
 *   get:
 *     summary: transactions list page
 *     description: Gets the list of all transactions in the application
 *     tags: [transactions]
 *     responses:
 *       200:
 *         description: the list of transactions
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Transaction'
 */
router.get("/", async function (req, res, next) {
  try {
    const transactions = await Transaction.findAll();
    res.json(transactions);
  } catch (error) {
    logger.error(error);
    res.status(500).end();
  }
});

export default router;
