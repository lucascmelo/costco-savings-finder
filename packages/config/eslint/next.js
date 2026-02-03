const baseConfig = require("./base.js");

/** @type {import("eslint").Linter.Config} */
module.exports = {
  ...baseConfig,
  extends: [
    ...baseConfig.extends,
    "next/core-web-vitals",
    "next/typescript",
  ],
  env: {
    ...baseConfig.env,
    browser: true,
  },
};
