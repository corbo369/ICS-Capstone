/**
 * @file Index router
 * @author Sam DeCoursey <samdecoursey@ksu.edu>
 * @exports router an Express router
 *
 * @swagger
 * tags:
 *   name: index
 *   description: Index Routes
 */

// Import libraries
import express from "express";

// Create Express router
const router = express.Router();

/**
 * Gets the index page for the application
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 *
 * @swagger
 * /:
 *   get:
 *     summary: index page
 *     description: Gets the index page for the application
 *     tags: [index]
 *     responses:
 *       200:
 *         description: success
 */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

export default router;