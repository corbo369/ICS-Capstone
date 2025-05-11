/**
 * @file Users seed
 * @author Sam DeCoursey <samdecoursey@ksu.edu>
 * @exports up the Up migration
 * @exports down the Down migration
 */

// Array of objects to add to the database
const users = [
  {
    UserID: 1,
    UserAddress: "0x5450dABa17ECB518e445A6Fc641628A628084196",
  },
  {
    UserID: 2,
    UserAddress: "0xe1c8465CAb0Eb3CA12947aF4f2518968F6e4aFc9",
  },
  {
    UserID: 3,
    UserAddress: "0xa951720A592d5Ba88c827e2d7bBbBf59b23A4453",
  },
  {
    UserID: 4,
    UserAddress: "0xBB041Bd376f6F603a8a41cc19d5ae7579269b589",
  },
  {
    UserID: 5,
    UserAddress: "0x2588CC21D3076c2D4AeF5a274FB5Ef2b2C688B70",
  }
];

/**
 * Apply the seed
 *
 * @param {queryInterface} context the database context to use
 */
export async function up({ context: queryInterface }) {
  await queryInterface.bulkInsert("Users", users);
}

/**
 * Roll back the seed
 *
 * @param {queryInterface} context the database context to use
 */
export async function down({ context: queryInterface }) {
  await queryInterface.bulkDelete("Users", {}, { truncate: true });
}
