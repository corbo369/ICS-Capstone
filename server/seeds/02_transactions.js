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
  {
    TransactionID: 7,
    UserID: 5,
    Type: true,
    Amount: 7496,
    Price: 1.16065,
    Date: '2025-05-09',
    AssetID: 6,
  },
  {
    TransactionID: 8,
    UserID: 5,
    Type: true,
    Amount: 142,
    Price: 18.5,
    Date: '2025-05-09',
    AssetID: 5,
  },
  {
    TransactionID: 9,
    UserID: 5,
    Type: true,
    Amount: 0.03943,
    Price: 98896,
    Date: '2025-05-07',
    AssetID: 1,
  },
  {
    TransactionID: 10,
    UserID: 5,
    Type: false,
    Amount: 7500,
    Price: 1.0657,
    Date: '2025-05-04',
    AssetID: 6,
  },
  {
    TransactionID: 11,
    UserID: 5,
    Type: false,
    Amount: 1034,
    Price: 1.0608,
    Date: '2025-04-22',
    AssetID: 6,
  },
  {
    TransactionID: 12,
    UserID: 5,
    Type: false,
    Amount: 150.64,
    Price: 18.379,
    Date: '2025-04-19',
    AssetID: 5,
  },
  {
    TransactionID: 13,
    UserID: 5,
    Type: false,
    Amount: 7510,
    Price: 0.75216,
    Date: '2025-04-18',
    AssetID: 6,
  },
  {
    TransactionID: 14,
    UserID: 5,
    Type: true,
    Amount: 8537,
    Price: 0.764676,
    Date: '2025-04-18',
    AssetID: 6,
  },
  {
    TransactionID: 15,
    UserID: 5,
    Type: false,
    Amount: 150,
    Price: 15.415,
    Date: '2025-04-13',
    AssetID: 5,
  },
  {
    TransactionID: 16,
    UserID: 5,
    Type: false,
    Amount: 150,
    Price: 15.452,
    Date: '2025-04-13',
    AssetID: 5,
  },
  {
    TransactionID: 17,
    UserID: 5,
    Type: false,
    Amount: 7899,
    Price: 0.838,
    Date: '2025-04-13',
    AssetID: 6,
  },
  {
    TransactionID: 18,
    UserID: 5,
    Type: true,
    Amount: 8130,
    Price: 0.81254,
    Date: '2025-04-13',
    AssetID: 6,
  },
  {
    TransactionID: 19,
    UserID: 5,
    Type: false,
    Amount: 620,
    Price: 0.84,
    Date: '2025-04-13',
    AssetID: 6,
  },
  {
    TransactionID: 20,
    UserID: 5,
    Type: true,
    Amount: 4182,
    Price: 0.8599,
    Date: '2025-04-12',
    AssetID: 6,
  },
  {
    TransactionID: 21,
    UserID: 5,
    Type: true,
    Amount: 0.06907,
    Price: 83973,
    Date: '2025-04-11',
    AssetID: 1,
  },
  {
    TransactionID: 22,
    UserID: 5,
    Type: false,
    Amount: 150,
    Price: 13.573,
    Date: '2025-04-10',
    AssetID: 5,
  },
  {
    TransactionID: 23,
    UserID: 5,
    Type: true,
    Amount: 300.74,
    Price: 13.835,
    Date: '2025-04-10',
    AssetID: 5,
  },
  {
    TransactionID: 24,
    UserID: 5,
    Type: true,
    Amount: 3717,
    Price: 0.8363,
    Date: '2025-04-10',
    AssetID: 6,
  },
  {
    TransactionID: 25,
    UserID: 5,
    Type: true,
    Amount: 0.12844,
    Price: 77852,
    Date: '2025-04-09',
    AssetID: 1,
  },
  {
    TransactionID: 26,
    UserID: 5,
    Type: true,
    Amount: 0.07513,
    Price: 79932,
    Date: '2025-04-09',
    AssetID: 1,
  },
  {
    TransactionID: 27,
    UserID: 5,
    Type: true,
    Amount: 300,
    Price: 13.361,
    Date: '2025-04-09',
    AssetID: 5,
  },
  {
    TransactionID: 28,
    UserID: 5,
    Type: false,
    Amount: 154.15,
    Price: 13.793,
    Date: '2025-04-09',
    AssetID: 5,
  },
  {
    TransactionID: 29,
    UserID: 5,
    Type: true,
    Amount: 904.58,
    Price: 12.241,
    Date: '2025-04-08',
    AssetID: 5,
  },
  {
    TransactionID: 30,
    UserID: 5,
    Type: true,
    Amount: 480,
    Price: 4.2,
    Date: '2023-05-03',
    AssetID: 5,
  },
  {
    TransactionID: 31,
    UserID: 5,
    Type: true,
    Amount: 228,
    Price: 22,
    Date: '2023-05-01',
    AssetID: 5,
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
