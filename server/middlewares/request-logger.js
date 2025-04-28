/**
 * @file Middleware file used to request logger
 * @author Sam DeCoursey <samdecoursey@ksu.edu>
 * @exports requestLogger Logger requester
 */

// Import libraries
import morgan from "morgan";

// Import logging configuration
import logger from "../configs/logger.js";

// Override morgan stream method to use our custom logger
// Log Format
// :method :url :status :response-time ms - :res[content-length]
const stream = {
  write: (message) => {
    // log using the 'http' severity
    logger.http(message.trim());
  },
};

// See https://github.com/expressjs/morgan?tab=readme-ov-file#api
const requestLogger = morgan("dev", { stream });

export default requestLogger;
