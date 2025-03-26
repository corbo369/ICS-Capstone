/**
 * @file Transactions table migration
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
    UserID: {
      type: Sequelize.INTEGER,
      foreignKey: true,
      allowNull: false,
    },
    AssetID: {
      type: Sequelize.INTEGER,
      foreignKey: true,
      allowNull: false,
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
      type: Sequelize.DATE,
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
