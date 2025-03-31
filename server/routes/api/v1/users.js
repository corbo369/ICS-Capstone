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

// Import models
import { User, Asset, Transaction } from "../../../models/models.js";

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
    const users = await User.findAll();
    res.json(users);
  } catch (error) {
    logger.error(error);
    res.status(500).end();
  }
});

router.get("/:userId/transactions", async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    const transactions = await Transaction.findAll({
      where: { UserID: userId },
      order: [["Date", "DESC"]],
      include: [
        {
          model: Asset,
          as: "Asset",
          attributes: ["Name", "Symbol"]
        }
      ]
    });
    res.json(transactions);
  } catch (error) {
    logger.error(error);
    res.status(500).end();
  }
});

router.post("/:userId/transactions", async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    const { AssetID, Amount, Price, Type, Date } = req.body;

    const newTransaction = await Transaction.create({
      UserID: userId,
      AssetID,
      Amount,
      Price,
      Type,
      Date,
    });

    res.status(201).json(newTransaction);
  } catch (error) {
    logger.error(error);
    res.status(500).end();
  }
});

export default router;
