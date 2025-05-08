/**
 * @file TransactionsList table migration
 * @author Sam DeCoursey <samdecoursey@ksu.edu>
 * @exports up the Up migration
 * @exports down the Down migration
 */

// Import Libraries
import { Sequelize } from "sequelize";

/**
 * Apply the migration
 *
 * @param {queryInterface} context the database context to use
 */
export async function up({ context: queryInterface }) {
  await queryInterface.createTable("Transactions", {
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
  });
}

/**
 * Roll back the migration
 *
 * @param {queryInterface} context the database context to use
 */
export async function down({ context: queryInterface }) {
  await queryInterface.dropTable("Transactions");
}
