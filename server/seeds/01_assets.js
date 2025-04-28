/**
 * @file Assets seed
 * @author Sam DeCoursey <samdecoursey@ksu.edu>
 * @exports up the Up migration
 * @exports down the Down migration
 */

// Array of objects to add to the database
const assets = [
  {
    AssetID: 1,
    ChainID: "solana",
    ContractAddress: "3NZ9JMVBmGAqocybic2c7LQCJScmgsAZ6vQqTDzcqmJh",
    Name: "Wrapped BTC (Wormhole)",
    Symbol: "WBTC",
  },
  {
    AssetID: 2,
    ChainID: "hyperliquid",
    ContractAddress: "0x0d01dc56dcaaca66ad901c959b4011ec",
    Name: "Hyperliquid",
    Symbol: "HYPE",
  },
  {
    AssetID: 3,
    ChainID: "solana",
    ContractAddress: "9BB6NFEcjBCtnNLFko2FqVQBq8HHM13kCyYcdQbgpump",
    Name: "Fartcoin",
    Symbol: "Fartcoin",
  },
];

/**
 * Apply the migration
 *
 * @param {queryInterface} context the database context to use
 */
export async function up({ context: queryInterface }) {
  await queryInterface.bulkInsert("Assets", assets);
}

/**
 * Roll back the migration
 *
 * @param {queryInterface} context the database context to use
 */
export async function down({ context: queryInterface }) {
  await queryInterface.bulkDelete("Assets", {}, { truncate: true });
}
