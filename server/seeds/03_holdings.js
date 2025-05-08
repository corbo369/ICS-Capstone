/**
 * @file HoldingsList seed
 * @author Sam DeCoursey <samdecoursey@ksu.edu>
 * @exports up the Up migration
 * @exports down the Down migration
 */

// Array of objects to add to the database
const holdings = [
  {
    HoldingID: 1,
    UserID: 1,
    AssetID: 1,
    Amount: 0.5,
  },
  {
    HoldingID: 2,
    UserID: 1,
    AssetID: 2,
    Amount: 5,
  },
  {
    HoldingID: 3,
    UserID: 1,
    AssetID: 3,
    Amount: 50,
  },
  {
    HoldingID: 4,
    UserID: 1,
    AssetID: 4,
    Amount: 5000,
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
