/**
 * @file Reports router
 * @author Sam DeCoursey <samdecoursey@ksu.edu>
 * @exports router an Express router
 *
 * @swagger
 * tags:
 *   name: reports
 *   description: Reports Routes
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
 * Gets a balance change report for a certain user over a time period
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 *
 * @swagger
 * /api/v1/reports/{id}/balance-change:
 *   get:
 *     summary: balance change report for a user
 *     description: Gets the balance changes for a certain user id over a date range
 *     tags: [reports]
 *     parameters:
 *          - in: path
 *            name: user ID
 *            required: true
 *            schema:
 *              type: integer
 *            description: user ID
 *          - in: query
 *            name: StartDate
 *            required: true
 *            schema:
 *              type: string
 *              format: date
 *            description: start date
 *          - in: query
 *            name: EndDate
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
 *             example:
 *               FirstTransactionDate: 2024-01-27
 *               LastTransactionDate: 2024-10-18
 *               Name: HYPE
 *               Symbol: HYPE
 *               ImagePath: https://dd.dexscreener.com/ds-data/tokens/hyperliquid/0x0d01dc56dcaaca66ad901c959b4011ec.png?key=ac1a77
 *               BalanceChange: 2000
 */
router.get(
  "/:userId/balance-change",
  authenticateUser,
  async function (req, res, next) {
    try {
      const UserID = parseInt(req.params.userId);
      const { StartDate, EndDate } = req.query;

      const balances = await database.query(
        `
          SELECT MIN(T.Date) AS FirstTransactionDate, MAX(T.Date) AS LastTransactionDate, A.Name, A.Symbol, A.ImagePath,
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
            UserID: UserID,
            StartDate: StartDate,
            EndDate: EndDate,
          },
        },
      );
      res.json(balances[0]);
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
 * /api/v1/reports/{id}/realized-profit:
 *   get:
 *     summary: realized profit report for a user
 *     description: Gets the realized profits for a certain user id over a date range
 *     tags: [reports]
 *     parameters:
 *          - in: path
 *            name: user ID
 *            required: true
 *            schema:
 *              type: integer
 *            description: user ID
 *          - in: query
 *            name: StartDate
 *            required: true
 *            schema:
 *              type: string
 *              format: date
 *            description: start date
 *          - in: query
 *            name: EndDate
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
 *             example:
 *               FirstTransactionDate: 2024-01-01
 *               LastTransactionDate: 2024-12-31
 *               Name: HYPE
 *               Symbol: HYPE
 *               ImagePath: https://dd.dexscreener.com/ds-data/tokens/hyperliquid/0x0d01dc56dcaaca66ad901c959b4011ec.png?key=ac1a77
 *               RealizedProfit: 26500
 */
router.get(
  "/:userId/realized-profit",
  authenticateUser,
  async function (req, res, next) {
    try {
      const UserID = parseInt(req.params.userId);
      const { StartDate, EndDate } = req.query;

      const profits = await database.query(
        `
          SELECT MIN(T.Date) AS FirstTransactionDate, MAX(T.Date) AS LastTransactionDate, A.Name, A.Symbol, A.ImagePath,
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
            UserID: UserID,
            StartDate: StartDate,
            EndDate: EndDate,
          },
        },
      );
      res.json(profits[0]);
    } catch (error) {
      logger.error(error);
      res.status(500).end();
    }
  },
);

/**
 * Gets a tax information report for a certain user over a time period
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 *
 * @swagger
 * /api/v1/reports/{id}/tax-information:
 *   get:
 *     summary: tax information report for a user
 *     description: Gets the tax information for a certain user id over a date range
 *     tags: [reports]
 *     parameters:
 *          - in: path
 *            name: user ID
 *            required: true
 *            schema:
 *              type: integer
 *            description: user ID
 *          - in: query
 *            name: StartDate
 *            required: true
 *            schema:
 *              type: string
 *              format: date
 *            description: start date
 *          - in: query
 *            name: EndDate
 *            required: true
 *            schema:
 *              type: string
 *              format: date
 *            description: end date
 *          - in: query
 *            name: CurrentDate
 *            required: true
 *            schema:
 *              type: string
 *              format: date
 *            description: current date
 *     responses:
 *       200:
 *         description: realized profit report for a user
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *             example:
 *               FirstTransactionDate: 2024-01-01
 *               LastTransactionDate: 2024-12-31
 *               Name: HYPE
 *               Symbol: HYPE
 *               ImagePath: https://dd.dexscreener.com/ds-data/tokens/hyperliquid/0x0d01dc56dcaaca66ad901c959b4011ec.png?key=ac1a77
 *               TotalLongTermEligibleAmount: 500
 *               TotalShortTermEligibleAmount: 1500
 *               TotalLongTermCapitalGains: 0
 *               TotalShortTermCapitalGains: 26500
 */
router.get(
  "/:userId/tax-information",
  authenticateUser,
  async function (req, res, next) {
    try {
      const UserID = parseInt(req.params.userId);
      const { StartDate, EndDate, CurrentDate } = req.query;

      const taxes = await database.query(
        `
            WITH LongTermBuyData AS
            (
                SELECT AssetID, 
                    SUM(Amount) AS TotalAmount, 
                    SUM(Amount * Price) AS TotalValue
                FROM Transactions
                WHERE (julianday(:CurrentDate) - julianday(Date)) >= 365
                    AND UserID = :UserID
                    AND Type = TRUE
                GROUP BY AssetID
            ),
            ShortTermBuyData AS
            (
                SELECT AssetID,
                     SUM(Amount) AS TotalAmount,
                     SUM(Amount * Price) AS TotalValue
                FROM Transactions
                WHERE (julianday(:CurrentDate) - julianday(Date)) < 365
                  AND UserID = :UserID
                  AND Type = TRUE
                GROUP BY AssetID
            ),
            IneligibleSellData AS
            (
                SELECT AssetID,
                    SUM(Amount) AS TotalAmount,
                    SUM(Amount * Price) AS TotalValue
                FROM Transactions
                WHERE Date NOT BETWEEN :StartDate AND :CurrentDate
                  AND UserID = :UserID
                    AND Type = FALSE
                GROUP BY AssetID
            ),
            EligibleSellData AS
            (
                SELECT AssetID,
                  SUM(Amount) AS TotalAmount,
                  SUM(Amount * Price) AS TotalValue
                FROM Transactions
                WHERE Date BETWEEN :StartDate AND :EndDate
                  AND UserID = :UserID
                  AND Type = FALSE
                GROUP BY AssetID
            ),
            TotalData AS
            (
                SELECT
                    A.AssetID,
                    A.Name,
                    A.Symbol,
                    A.ImagePath,
                    COALESCE(LTD.TotalAmount, 0) AS LTDAmount,
                    COALESCE(LTD.TotalValue, 0) AS LTDValue,
                    COALESCE(STD.TotalAmount, 0) AS STDAmount,
                    COALESCE(STD.TotalValue, 0) AS STDValue,
                    COALESCE(ISD.TotalAmount, 0) AS ISDAmount,
                    COALESCE(ISD.TotalValue, 0) AS ISDValue,
                    COALESCE(ESD.TotalAmount, 0) AS ESDAmount,
                    COALESCE(ESD.TotalValue, 0) AS ESDValue
                FROM Assets A
                    LEFT JOIN LongTermBuyData LTD ON A.AssetID = LTD.AssetID
                    LEFT JOIN ShortTermBuyData STD ON A.AssetID = STD.AssetID
                    LEFT JOIN IneligibleSellData ISD ON A.AssetID = ISD.AssetID
                    LEFT JOIN EligibleSellData ESD ON A.AssetID = ESD.AssetID
            )
            SELECT
                TD.AssetID, TD.Name, TD.Symbol, TD.ImagePath,
                CASE
                    WHEN TD.LTDAmount > 0
                        AND TD.LTDAmount - TD.ISDAmount - TD.ESDAmount > 0
                    THEN ROUND(TD.LTDAmount - TD.ISDAmount - TD.ESDAmount, 2)
                    ELSE 0
                END AS TotalLongTermEligibleAmount,
                CASE
                    WHEN TD.STDAmount - TD.ESDAmount > 0
                    THEN ROUND(TD.STDAmount - TD.ESDAmount, 2)
                    ELSE 0
                END AS TotalShortTermEligibleAmount,
                CASE
                    WHEN TD.LTDAmount - TD.ISDAmount > 0 AND TD.ESDAmount > 0
                        THEN 
                            CASE
                                WHEN TD.LTDAmount - TD.ISDAmount - TD.ESDAmount != 0
                                THEN ((CAST(TD.ESDAmount AS REAL) / TD.LTDAmount) * -(TD.LTDValue - TD.ISDValue)) + TD.ESDValue
                                ELSE ROUND((-TD.LTDValue) + TD.ISDValue + TD.ESDValue, 2)
                            END
                    ELSE 0
                END AS TotalLongTermCapitalGains,
                CASE
                    WHEN TD.STDAmount > 0 AND TD.ESDAmount > 0
                    THEN 
                        CASE
                            WHEN TD.STDAmount - TD.ESDAmount != 0
                            THEN ((CAST(TD.STDAmount - TD.ESDAmount AS REAL) / TD.STDAmount) * -TD.STDValue) + TD.ESDValue
                            ELSE (-TD.STDValue) + TD.ESDValue
                        END
                    ELSE 0
                END AS TotalShortTermCapitalGains
            FROM TotalData TD
        `,
        {
          replacements: {
            UserID: UserID,
            StartDate: StartDate,
            EndDate: EndDate,
            CurrentDate: CurrentDate,
          },
        },
      );
      res.json(taxes[0]);
    } catch (error) {
      logger.error(error);
      res.status(500).end();
    }
  },
);

export default router;
