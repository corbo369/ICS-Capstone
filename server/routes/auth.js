/**
 * @file Auth router
 * @author Sam DeCoursey <samdecoursey@ksu.edu>
 * @exports router an Express router
 *
 * @swagger
 * tags:
 *   name: auth
 *   description: Authentication Routes
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   responses:
 *     AuthToken:
 *       description: authentication success
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *             properties:
 *               token:
 *                 type: string
 *                 description: a JWT for the user
 *             example:
 *               token: abcdefg12345
 */

// Import libraries
import { ethers } from "ethers";
import express from "express";
import jsonwebtoken from "jsonwebtoken";

// Import Configs
import database from "../configs/database.js";
import logger from "../configs/logger.js";

// Create Express router
const router = express.Router();

/**
 * Login using JWT
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 *
 * @swagger
 * /auth/login:
 *   post:
 *     summary: request JWT
 *     description: request JWT
 *     tags: [auth]
 *     responses:
 *       200:
 *         $ref: '#/components/responses/AuthToken'
 */
router.post("/login", async (req, res, next) => {
  // Ethereum signature components
  const { address, message, signature } = req.body;

  try {
    // Recover Ethereum address from signed message
    const recoveredAddress = ethers.verifyMessage(message, signature);

    // Check address matches recovered address
    if (recoveredAddress.toLowerCase() !== address.toLowerCase()) {
      return res.status(401).end();
    }

    // Search for user in database, create new user if not found
    let [user] = await database.query(
      `SELECT * FROM Users WHERE UserAddress = :UserAddress`,
      {
        replacements: {
          UserAddress: address,
        },
      },
    );
    if (user.length === 0) {
      await database.query(
        `INSERT INTO Users (UserAddress) VALUES (:UserAddress)`,
        {
          replacements: {
            UserAddress: address,
          },
        },
      );
      [user] = await database.query(
        `SELECT * FROM Users WHERE UserAddress = :UserAddress`,
        {
          replacements: {
            UserAddress: address,
          },
        },
      );
    }

    // Create JWT
    const token = jsonwebtoken.sign(
      { id: user[0].UserID },
      process.env.JWT_SECRET_KEY,
    );
    res.json({
      token: token,
      userId: user[0].UserID,
    });
  } catch (error) {
    logger.error(error);
    res.status(500).end();
  }
});

export default router;
