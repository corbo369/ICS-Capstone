/**
 * @file TransactionsList seed
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
    UserID: 1,
    AssetID: 1,
    Amount: 2,
    Price: 20000,
    Type: true,
    Date: "2023-06-04",
  },
  {
    TransactionID: 2,
    UserID: 1,
    AssetID: 2,
    Amount: 10,
    Price: 1300,
    Type: true,
    Date: "2023-06-07",
  },
  {
    TransactionID: 3,
    UserID: 1,
    AssetID: 3,
    Amount: 50,
    Price: 20,
    Type: true,
    Date: "2023-02-13",
  },
  {
    TransactionID: 4,
    UserID: 1,
    AssetID: 4,
    Amount: 5000,
    Price: 1,
    Type: true,
    Date: "2024-03-20",
  },
  {
    TransactionID: 5,
    UserID: 1,
    AssetID: 2,
    Amount: 5,
    Price: 2500,
    Type: false,
    Date: "2023-06-07",
  },
  {
    TransactionID: 6,
    UserID: 1,
    AssetID: 1,
    Amount: 1.5,
    Price: 80000,
    Type: false,
    Date: "2024-03-20",
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
