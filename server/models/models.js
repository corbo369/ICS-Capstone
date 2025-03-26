/**
 * @file Database models
 * @author Sam DeCoursey <samdecoursey@ksu.edu>
 * @exports User a Sequelize User model
 * @exports Asset a Sequelize Asset model
 * @exports Transaction a Sequelize Transaction model
 * @exports Holding a Sequelize Holding model
 */

// Import database connection
import database from "../configs/database.js";

// Import Schemas
import UserSchema from "./user.js";
import AssetSchema from "./asset.js";
import TransactionSchema from "./transaction.js";
import HoldingSchema from "./holding.js";

// Create User Model
const User = database.define(
    // Model Name
    "User",
    // Schema
    UserSchema,
    // Other options
    {
        tableName: "Users",
        timestamps: false,
    },
);

// Create Role Model
const Asset = database.define(
    // Model Name
    "Asset",
    // Schema
    AssetSchema,
    // Other options
    {
        tableName: "Assets",
        timestamps: false,
    },
);

const Transaction = database.define(
    // Model Name
    "Transaction",
    // Schema
    TransactionSchema,
    // Other options
    {
      tableName: "Transactions",
      timestamps: false,
    },
)

const Holding = database.define(
    // Model Name
    "Holding",
    // Schema
    HoldingSchema,
    // Other options
    {
      tableName: "Holdings",
      timestamps: false,
    },
)

// Define Associations

export { User, Asset, Transaction, Holding };
