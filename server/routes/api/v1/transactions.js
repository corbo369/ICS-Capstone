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
 *            name: user ID
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
 *             example:
 *               TransactionID: 1
 *               Type: true
 *               Amount: 2000
 *               Price: 15
 *               Date: 2024-11-27
 *               Name: HYPE
 *               Symbol: HYPE
 *               ImagePath: https://dd.dexscreener.com/ds-data/tokens/hyperliquid/0x0d01dc56dcaaca66ad901c959b4011ec.png?key=ac1a77
 */
router.get("/:userId", authenticateUser, async function (req, res, next) {
  try {
    const UserID = parseInt(req.params.userId);

    const [transactions] = await database.query(
      `
        SELECT T.TransactionID, T.Type, T.Amount, T.Price, T.Date, A.Name, A.Symbol, A.ImagePath
        FROM Transactions T
            INNER JOIN Assets A ON A.AssetID = T.AssetID
        WHERE UserID = :UserID
        ORDER BY T.Date DESC
      `,
      {
        replacements: {
          UserID: UserID,
        },
      },
    );
    console.log(transactions);
    res.json(transactions);
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
 *     summary: create new transaction and update amount in holdings
 *     tags: [transactions]
 *     parameters:
 *          - in: path
 *            name: user ID
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
 *             Amount: 2000
 *             Price: 15
 *             Type: true
 *             Date: 2024-11-27
 */
router.post("/:userId", authenticateUser, async function (req, res, next) {
  try {
    const UserID = parseInt(req.params.userId);
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
            UPDATE SET Amount = Amount + EXCLUDED.Amount
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
      `
          SELECT MAX(TransactionID) as id
          FROM Transactions
          WHERE UserID = :UserID
            AND AssetID = :AssetID
            AND Amount = :Amount
            AND Price = :Price
            AND Type = :Type
            AND Date = :Date
      `,
      {
        replacements: {
          UserID,
          AssetID,
          Amount,
          Price,
          Type,
          Date,
        },
      },
    );

    const [transaction] = await database.query(
      `
          SELECT T.TransactionID, T.Type, T.Amount, T.Price, T.Date, A.Name, A.Symbol, A.ImagePath
          FROM Transactions T
                   INNER JOIN Assets A ON A.AssetID = T.AssetID
          WHERE T.TransactionID = :TransactionID
      `,
      {
        replacements: {
          TransactionID: lastTransaction[0].id,
        },
      },
    );

    res.status(201).json(transaction[0]);
  } catch (error) {
    logger.error(error);
    res.status(500).end();
  }
});

/**
 * Update a transaction
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 *
 * @swagger
 * /api/v1/transactions/{userId}/{transactionId}:
 *   put:
 *     summary: update an existing transaction and update amount in holdings
 *     tags: [transactions]
 *     parameters:
 *          - in: path
 *            name: userId
 *            required: true
 *            schema:
 *              type: integer
 *            description: user ID
 *          - in: path
 *            name: transactionId
 *            required: true
 *            schema:
 *              type: integer
 *            description: transaction ID
 *     requestBody:
 *       description: transaction
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Transaction'
 *           example:
 *             Amount: 2000
 *             Price: 15
 *             Type: true
 *             Date: 2024-11-27
 */
router.put(
  "/:userId/:transactionId",
  authenticateUser,
  async function (req, res, next) {
    try {
      const UserID = parseInt(req.params.userId);
      const TransactionID = parseInt(req.params.transactionId);
      const { Amount, Price, Type, Date } = req.body;

      const [oldTransaction] = await database.query(
        `
          SELECT * FROM Transactions WHERE TransactionID = :TransactionID
      `,
        {
          replacements: {
            TransactionID: TransactionID,
          },
        },
      );

      await database.query(
        `
        UPDATE Transactions
        SET Amount = :Amount,
            Price = :Price,
            Type = :Type,
            Date = :Date
        WHERE TransactionID = :TransactionID AND UserID = :UserID
      `,
        {
          replacements: {
            TransactionID: TransactionID,
            UserID: UserID,
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
            UPDATE SET Amount = Amount + EXCLUDED.Amount
      `,
        {
          replacements: {
            UserID: UserID,
            AssetID: oldTransaction[0].AssetID,
            Amount: oldTransaction[0].Type
              ? -oldTransaction[0].Amount
              : oldTransaction[0].Amount,
          },
        },
      );

      await database.query(
        `
        INSERT INTO Holdings (UserID, AssetID, Amount)
        VALUES (:UserID, :AssetID, :Amount)
        ON CONFLICT(UserID, AssetID) DO 
            UPDATE SET Amount = Amount + EXCLUDED.Amount
      `,
        {
          replacements: {
            UserID: UserID,
            AssetID: oldTransaction[0].AssetID,
            Amount: Type ? Amount : -Amount,
          },
        },
      );

      const [updatedTransaction] = await database.query(
        `
          SELECT T.TransactionID, T.Type, T.Amount, T.Price, T.Date, A.Name, A.Symbol, A.ImagePath
          FROM Transactions T
                   INNER JOIN Assets A ON A.AssetID = T.AssetID
          WHERE T.TransactionID = :LastTransactionID
      `,
        {
          replacements: {
            LastTransactionID: TransactionID,
          },
        },
      );

      res.status(201).json(updatedTransaction[0]);
    } catch (error) {
      logger.error(error);
      res.status(500).end();
    }
  },
);

/**
 * Delete a transaction
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 *
 * @swagger
 * /api/v1/transactions/{userId}/{transactionId}:
 *   delete:
 *     summary: delete an existing transaction and update amount in holdings
 *     tags: [transactions]
 *     parameters:
 *          - in: path
 *            name: userId
 *            required: true
 *            schema:
 *              type: integer
 *            description: user ID
 *          - in: path
 *            name: transactionId
 *            required: true
 *            schema:
 *              type: integer
 *            description: transaction ID
 */
router.delete(
  "/:userId/:transactionId",
  authenticateUser,
  async function (req, res, next) {
    try {
      const UserID = parseInt(req.params.userId);
      const TransactionID = parseInt(req.params.transactionId);

      const [oldTransaction] = await database.query(
        `
          SELECT * FROM Transactions WHERE TransactionID = :TransactionID
      `,
        {
          replacements: {
            TransactionID: TransactionID,
          },
        },
      );

      await database.query(
        `
        INSERT INTO Holdings (UserID, AssetID, Amount)
        VALUES (:UserID, :AssetID, :Amount)
        ON CONFLICT(UserID, AssetID) DO 
            UPDATE SET Amount = Amount + EXCLUDED.Amount
      `,
        {
          replacements: {
            UserID: UserID,
            AssetID: oldTransaction[0].AssetID,
            Amount: oldTransaction[0].Type
              ? -oldTransaction[0].Amount
              : oldTransaction[0].Amount,
          },
        },
      );

      await database.query(
        `
        DELETE FROM Transactions WHERE TransactionID = :TransactionID
      `,
        {
          replacements: {
            TransactionID,
          },
        },
      );

      res.status(200).end();
    } catch (error) {
      logger.error(error);
      res.status(500).end();
    }
  },
);

export default router;
