/**
 * @file Transactions seed
 * @author Sam DeCoursey <samdecoursey@ksu.edu>
 * @exports up the Up migration
 * @exports down the Down migration
 */

// Timestamp in the appropriate format for the database
//const now = new Date().toISOString().slice(0, 23).replace("T", " ") + " +00:00";

// Array of objects to add to the database
const transactions = [
  {
    TransactionID: 1,
    UserID: 2,
    AssetID: 1,
    Amount: 0.273,
    Price: 80000,
    Type: true,
    Date: "2025-04-16 20:34:32.709",
  },
  {
    TransactionID: 2,
    UserID: 2,
    AssetID: 2,
    Amount: 900,
    Price: 12.85,
    Type: true,
    Date: "2025-04-17 20:34:32.709",
  },
  {
    TransactionID: 3,
    UserID: 2,
    AssetID: 3,
    Amount: 7500,
    Price: 0.8,
    Type: true,
    Date: "2025-04-18 20:34:32.709",
  },
];

/**
 * Apply the migration
 *
 * @param {queryInterface} context the database context to use
 */
export async function up({ context: queryInterface }) {
  await queryInterface.bulkInsert("Transactions", transactions);
}

/**
 * Roll back the migration
 *
 * @param {queryInterface} context the database context to use
 */
export async function down({ context: queryInterface }) {
  await queryInterface.bulkDelete("Assets", {}, { truncate: true });
}
