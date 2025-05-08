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
    Name: "Bitcoin",
    Symbol: "BTC",
    ImagePath:
      "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/bitcoin/info/logo.png",
  },
  {
    AssetID: 2,
    ChainID: "solana",
    ContractAddress: "7vfCXTUXx5WJV5JADk17DUJ4ksgau7utNKj4b963voxs",
    Name: "Ethereum",
    Symbol: "ETH",
    ImagePath:
      "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/info/logo.png",
  },
  {
    AssetID: 3,
    ChainID: "sui",
    ContractAddress:
      "0xb7844e289a8410e50fb3ca48d69eb9cf29e27d223ef90353fe1bd8e27ff8f3f8::coin::COIN",
    Name: "Solana",
    Symbol: "SOL",
    ImagePath:
      "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/solana/info/logo.png",
  },
  {
    AssetID: 4,
    ChainID: "base",
    ContractAddress: "0xfde4C96c8593536E31F229EA8f37b2ADa2699bb2",
    Name: "USDC",
    Symbol: "USDC",
    ImagePath:
      "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png",
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
