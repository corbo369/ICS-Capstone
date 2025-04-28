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

// Import database
import database from "../../../configs/database.js";

// Import logger
import logger from "../../../configs/logger.js";

// Import middlewares
import authenticateUser from "../../../middlewares/authenticate-user.js";

/**
 * Gets the list of transactions for a certain user
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 *
 * @swagger
 * /api/v1/transactions/{id}:
 *   get:
 *     summary: transactions list page for a user
 *     description: Gets the list of all transactions for a certain user id
 *     tags: [transactions]
 *     parameters:
 *          - in: path
 *            name: id
 *            required: true
 *            schema:
 *              type: integer
 *            description: user ID
 *     responses:
 *       200:
 *         description: the list of transactions for a user
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Transaction'
 */
router.get("/:id", authenticateUser, async function (req, res, next) {
  try {
    const transactions = await database.query(
      `
        SELECT T.TransactionID, T.Type, A.Name, T.Amount, A.Symbol, T.Price, T.Date
        FROM Transactions T
                 INNER JOIN Assets A ON A.AssetID = T.AssetID
        WHERE UserID=${req.params.id}
        ORDER BY T.Date DESC
      `,
    );
    res.json(transactions[0]);
  } catch (error) {
    logger.error(error);
    res.status(500).end();
  }
});

/**
 * Create a new transaction for a certain user
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 *
 * @swagger
 * /api/v1/transactions:
 *   post:
 *     summary: create transaction
 *     tags: [transactions]
 *     parameters:
 *          - in: path
 *            name: id
 *            required: true
 *            schema:
 *              type: integer
 *            description: user ID
 *     requestBody:
 *       description: new transaction
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Transaction'
 *           example:
 *             AssetID: 1
 *             Amount: 100
 *             Price: 14.2
 *             Type: 1
 *             Date: "example date"
 *     responses:
 *       201:
 *         $ref: '#/components/responses/Success'
 *       422:
 *         $ref: '#/components/responses/ValidationError'
 */
router.post("/:id", authenticateUser, async function (req, res, next) {
  try {
    const UserID = parseInt(req.params.id);
    const { AssetID, Amount, Price, Type, Date } = req.body;

    await database.query(
      `
        INSERT INTO Transactions(UserID, AssetID, Amount, Price, Type, Date) 
        VALUES (:UserID, :AssetID, :Amount, :Price, :Type, :Date)
      `,
      {
        replacements: {
          UserID: UserID,
          AssetID: AssetID,
          Amount: Amount,
          Price: Price,
          Type: Type,
          Date: Date,
        },
      },
    );

    await database.query(
      `
        INSERT INTO Holdings (UserID, AssetID, Amount)
        VALUES (:UserID, :AssetID, :Amount)
        ON CONFLICT(UserID, AssetID) DO 
            UPDATE 
                SET Amount = ROUND(Amount + EXCLUDED.Amount, 8)
      `,
      {
        replacements: {
          UserID: UserID,
          AssetID: AssetID,
          Amount: Type ? Amount : -Amount,
        },
      },
    );

    const [lastTransaction] = await database.query(
      `SELECT last_insert_rowid() as id`,
    );
    const [transaction] = await database.query(
      `SELECT * FROM Transactions WHERE TransactionID = ${lastTransaction[0].id}`,
    );

    res.status(201).json(transaction[0]);
  } catch (error) {
    logger.error(error);
    res.status(500).end();
  }
});

/**
 * Gets a balance change report for a certain user over a time period
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 *
 * @swagger
 * /api/v1/transactions/{id}/balance-change:
 *   get:
 *     summary: balance change report for a user
 *     description: Gets the balance changes for a certain user id over a date range
 *     tags: [transactions]
 *     parameters:
 *          - in: path
 *            name: id
 *            required: true
 *            schema:
 *              type: integer
 *            description: user ID
 *          - in: query
 *            name: start
 *            required: true
 *            schema:
 *              type: string
 *              format: date
 *            description: start date
 *          - in: query
 *            name: end
 *            required: true
 *            schema:
 *              type: string
 *              format: date
 *            description: end date
 *     responses:
 *       200:
 *         description: balance change report for a user
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Transaction'
 */
router.get(
  "/:id/balance-change",
  authenticateUser,
  async function (req, res, next) {
    try {
      const id = parseInt(req.params.id);
      const { start, end } = req.query;

      const [balances] = await database.query(
        `
        SELECT MIN(T.Date) AS FirstTransactionDate, MAX(T.Date) AS LastTransactionDate, A.Name, A.Symbol,
            ROUND(SUM(CASE WHEN T.Type THEN T.Amount ELSE -T.Amount END), 5) AS BalanceChange
        FROM Transactions T
            INNER JOIN Assets A ON A.AssetID = T.AssetID
        WHERE UserID = :UserID
            AND T.Date BETWEEN :StartDate AND :EndDate
        GROUP BY A.Name, A.Symbol
        ORDER BY FirstTransactionDate ASC
      `,
        {
          replacements: {
            UserID: id,
            StartDate: start,
            EndDate: end,
          },
        },
      );
      res.json(balances);
    } catch (error) {
      logger.error(error);
      res.status(500).end();
    }
  },
);

/**
 * Gets a realized profits report for a certain user over a time period
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 *
 * @swagger
 * /api/v1/transactions/{id}/realized-profit:
 *   get:
 *     summary: realized profit report for a user
 *     description: Gets the realized profits for a certain user id over a date range
 *     tags: [transactions]
 *     parameters:
 *          - in: path
 *            name: id
 *            required: true
 *            schema:
 *              type: integer
 *            description: user ID
 *          - in: query
 *            name: start
 *            required: true
 *            schema:
 *              type: string
 *              format: date
 *            description: start date
 *          - in: query
 *            name: end
 *            required: true
 *            schema:
 *              type: string
 *              format: date
 *            description: end date
 *     responses:
 *       200:
 *         description: realized profit report for a user
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Transaction'
 */
router.get(
  "/:id/realized-profit",
  authenticateUser,
  async function (req, res, next) {
    try {
      const id = parseInt(req.params.id);
      const { start, end } = req.query;

      const [profits] = await database.query(
        `
        SELECT MIN(T.Date) AS FirstTransactionDate, MAX(T.Date) AS LastTransactionDate, A.Name, A.Symbol,
            ROUND(SUM(CASE WHEN T.Type THEN -T.Amount * T.Price ELSE T.Amount * T.Price END), 2) AS RealizedProfit
        FROM Transactions T
            INNER JOIN Assets A ON A.AssetID = T.AssetID
        WHERE UserID = :UserID
            AND T.Date BETWEEN :StartDate AND :EndDate
        GROUP BY A.Name, A.Symbol
        ORDER BY RealizedProfit DESC
      `,
        {
          replacements: {
            UserID: id,
            StartDate: start,
            EndDate: end,
          },
        },
      );
      res.json(profits);
    } catch (error) {
      logger.error(error);
      res.status(500).end();
    }
  },
);

export default router;
