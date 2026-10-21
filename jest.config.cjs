// jest.config.cjs
/**
 * Jest configuration for the API project.
 * Using ESM (type: "module" in package.json), so we need to set the
 * test environment to node and tell Jest to run in ESM mode.
 */
module.exports = {
  testEnvironment: 'node',
  // Look for test files inside the "tests" directory
  testMatch: ['**/tests/**/*.test.[jt]s'],
  // Increase timeout for async DB operations
  testTimeout: 30000,
};
