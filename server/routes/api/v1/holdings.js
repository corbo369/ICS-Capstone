/**
 * @file Holdings router
 * @author Sam DeCoursey <samdecoursey@ksu.edu>
 * @exports router an Express router
 *
 * @swagger
 * tags:
 *   name: holdings
 *   description: Holdings Routes
 */

// Import libraries
import express from "express";

// Create Express router
const router = express.Router();

// Import database
import database from "../../../configs/database.js";

// Import logger
import logger from "../../../configs/logger.js";

// Import middlewares
import authenticateUser from "../../../middlewares/authenticate-user.js";

/**
 * Gets the list of holdings for a certain user
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 *
 * @swagger
 * /api/v1/holdings/{id}:
 *   get:
 *     summary: holdings list page for a user
 *     description: Gets the list of all holdings for a certain user id
 *     tags: [holdings]
 *     parameters:
 *          - in: path
 *            name: id
 *            required: true
 *            schema:
 *              type: integer
 *            description: user ID
 *     responses:
 *       200:
 *         description: the list of holdings for a user
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Holding'
 */
router.get("/:id", authenticateUser, async function (req, res, next) {
  try {
    const holdings = await database.query(
      `
        SELECT H.HoldingID, H.Amount, A.Name, A.Symbol, A.ChainID, A.ContractAddress,
               (
                   SELECT 
                       CASE 
                           WHEN SUM(CASE WHEN T.Type THEN T.Amount ELSE -T.Amount END) != 0
                           THEN SUM(CASE WHEN T.Type THEN T.Amount * T.Price ELSE -T.Amount * T.Price END) 
                                    / SUM(CASE WHEN T.Type THEN T.Amount ELSE -T.Amount END)
                           ELSE 0
                       END
                   FROM Transactions T
                   WHERE T.UserID = H.UserID
                       AND T.AssetID = H.AssetID
               ) AS AveragePrice
        FROM Holdings H
                 INNER JOIN Assets A ON A.AssetID = H.AssetID
        WHERE UserID=${req.params.id}
      `,
    );
    res.json(holdings[0]);
  } catch (error) {
    logger.error(error);
    res.status(500).end();
  }
});

export default router;
