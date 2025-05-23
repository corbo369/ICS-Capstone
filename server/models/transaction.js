/**
 * @file Transaction model
 * @author Sam DeCoursey <samdecoursey@ksu.edu>
 * @exports TransactionSchema the schema for the Transaction model
 */

// Import libraries
import Sequelize from "sequelize";

/**
 * @swagger
 * components:
 *   schemas:
 *     Transaction:
 *       type: object
 *       required:
 *         - UserID
 *         - AssetID
 *         - Amount
 *         - Price
 *         - Type
 *         - Date
 *       properties:
 *         TransactionID:
 *           type: integer
 *           description: autogenerated id
 *         UserID:
 *           type: integer
 *           description: owner of the transaction
 *         AssetID:
 *           type: integer
 *           description: asset of the transaction
 *         Amount:
 *           type: decimal
 *           description: amount bought or sold
 *         Price:
 *           type: decimal
 *           description: asset price for transaction
 *         Type:
 *           type: boolean
 *           description: true = buy, false = sell
 *         Date:
 *           type: date
 *           description: date of transaction
 *       example:
 *           TransactionID: 1
 *           UserID: 1
 *           AssetID: 1
 *           Amount: 2000
 *           Price: 15
 *           Type: true
 *           Date: 2024-11-27
 */
const TransactionSchema = {
  TransactionID: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  UserID: {
    type: Sequelize.INTEGER,
    allowNull: false,
    foreignKey: true,
    references: {
      model: "Users",
      key: "UserID",
    },
  },
  AssetID: {
    type: Sequelize.INTEGER,
    allowNull: false,
    foreignKey: true,
    references: {
      model: "Assets",
      key: "AssetID",
    },
  },
  Amount: {
    type: Sequelize.DECIMAL,
    allowNull: false,
  },
  Price: {
    type: Sequelize.DECIMAL,
    allowNull: false,
  },
  Type: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
  },
  Date: {
    type: Sequelize.DATEONLY,
    allowNull: false,
  },
};

export default TransactionSchema;
