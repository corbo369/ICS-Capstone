/**
 * @file Middleware for verifying user id from JWTs for route authentication
 * @author Sam DeCoursey <samdecoursey@ksu.edu>
 * @exports authenticateUser the authentication middleware
 */

// Import configurations
import logger from "../configs/logger.js";

/**
 * Middleware function to validate a token's user id matches the user id of the route
 */
function authenticateUser(req, res, next) {
  const tokenUserId = req.token?.id;
  const routeUserId = parseInt(req.params.userId);

  // If no user id in token, or no match, send 403 forbidden
  if (!tokenUserId || tokenUserId !== routeUserId) {
    logger.error("Authentication Error!");
    return res.sendStatus(403);
  }

  next();
}

export default authenticateUser;
