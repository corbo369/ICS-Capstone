/**
 * @file Assets router
 * @author Sam DeCoursey <samdecoursey@ksu.edu>
 * @exports router an Express router
 *
 * @swagger
 * tags:
 *   name: assets
 *   description: Assets Routes
 */

// Import libraries
import express from "express";

// Create Express router
const router = express.Router();

// Import database
import database from "../../../configs/database.js";

// Import logger
import logger from "../../../configs/logger.js";

/**
 * Gets the list of Assets
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 *
 * @swagger
 * /api/v1/assets:
 *   get:
 *     summary: assets list page
 *     description: Gets the list of all assets in the application
 *     tags: [assets]
 *     responses:
 *       200:
 *         description: the list of assets
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Asset'
 */
router.get("/", async function (req, res, next) {
  try {
    const assets = await database.query(
      `
        SELECT * FROM Assets
      `,
    );
    res.json(assets[0]);
  } catch (error) {
    logger.error(error);
    res.status(500).end();
  }
});

/**
 * Gets a single asset
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 *
 * @swagger
 * /api/v1/assets/{id}:
 *   get:
 *     summary: returns a single asset
 *     description: Gets the asset for a certain asset id
 *     tags: [assets]
 *     parameters:
 *          - in: path
 *            name: asset ID
 *            required: true
 *            schema:
 *              type: integer
 *            description: asset ID
 *     responses:
 *       200:
 *         description: asset from id
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Asset'
 */
router.get("/:id", async function (req, res, next) {
  try {
    const asset = await database.query(
      `
        SELECT * FROM Assets
        WHERE AssetID = :AssetID
      `,
      {
        replacements: {
          AssetID: req.params.id,
        },
      },
    );
    res.json(asset[0][0]);
  } catch (error) {
    logger.error(error);
    res.status(500).end();
  }
});

/**
 * Create a new asset
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 *
 * @swagger
 * /api/v1/assets:
 *   post:
 *     summary: create and return a new asset
 *     tags: [assets]
 *     requestBody:
 *       description: asset
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Asset'
 *           example:
 *             ChainID: hyperliquid
 *             ContractAddress: "0x0d01dc56dcaaca66ad901c959b4011ec"
 *             Name: HYPE
 *             Symbol: HYPE
 *             ImagePath: https://dd.dexscreener.com/ds-data/tokens/hyperliquid/0x0d01dc56dcaaca66ad901c959b4011ec.png?key=ac1a77
 */
router.post("/", async function (req, res, next) {
  try {
    const { ChainID, ContractAddress, Name, Symbol, ImagePath } = req.body;

    await database.query(
      `
        INSERT INTO Assets(ChainID, ContractAddress, Name, Symbol, ImagePath) 
        SELECT :ChainID, :ContractAddress, :Name, :Symbol, :ImagePath
        WHERE NOT EXISTS 
        (
            SELECT 1 
            FROM Assets 
            WHERE ChainID = :ChainID 
                AND ContractAddress = :ContractAddress
        )
      `,
      {
        replacements: {
          ChainID: ChainID,
          ContractAddress: ContractAddress,
          Name: Name,
          Symbol: Symbol,
          ImagePath: ImagePath,
        },
      },
    );

    const asset = await database.query(
      `
        SELECT * FROM Assets
        WHERE ChainID = :ChainID 
          AND ContractAddress = :ContractAddress
      `,
      {
        replacements: {
          ChainID: ChainID,
          ContractAddress: ContractAddress,
        },
      },
    );

    res.status(201).json(asset[0]);
  } catch (error) {
    logger.error(error);
    res.status(500).end();
  }
});

export default router;
