/**
 * @file Holdings seed
 * @author Sam DeCoursey <samdecoursey@ksu.edu>
 * @exports up the Up migration
 * @exports down the Down migration
 */

// Array of objects to add to the database
const holdings = [
  {
    HoldingID: 1,
    UserID: 2,
    AssetID: 1,
    Amount: 0.273,
  },
  {
    HoldingID: 2,
    UserID: 2,
    AssetID: 2,
    Amount: 900,
  },
  {
    HoldingID: 3,
    UserID: 2,
    AssetID: 3,
    Amount: 7500,
  },
];

/**
 * Apply the migration
 *
 * @param {queryInterface} context the database context to use
 */
export async function up({ context: queryInterface }) {
  await queryInterface.bulkInsert("Holdings", holdings);
}

/**
 * Roll back the migration
 *
 * @param {queryInterface} context the database context to use
 */
export async function down({ context: queryInterface }) {
  await queryInterface.bulkDelete("Holdings", {}, { truncate: true });
}
