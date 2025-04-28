/**
 * @file Users table migration
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
  await queryInterface.createTable("Users", {
    UserID: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    UserAddress: {
      type: Sequelize.STRING,
      unique: true,
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
  await queryInterface.dropTable("Users");
}
