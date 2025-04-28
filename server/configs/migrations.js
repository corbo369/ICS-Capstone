/**
 * @file Configuration information for Umzug migration engine
 * @author Sam DeCoursey <samdecoursey@ksu.edu>
 * @exports umzug an Umzug instance
 */

// Import Libraries
import { Umzug, SequelizeStorage } from "umzug";

// Import database configuration
import database from "./database.js";
import logger from "./logger.js";

// Create Umzug instance
const umzug = new Umzug({
  migrations: { glob: "migrations/*.js" },
  context: database.getQueryInterface(),
  storage: new SequelizeStorage({
    sequelize: database,
    modelName: "migrations",
  }),
  logger: logger,
});

export default umzug;
