module.exports = {
  eslint: {
    base: require("./eslint/base.js"),
    next: require("./eslint/next.js"),
  },
  tsconfig: {
    base: require("./tsconfig/base.json"),
    nextjs: require("./tsconfig/nextjs.json"),
    reactLibrary: require("./tsconfig/react-library.json"),
  },
  tailwind: {
    base: require("./tailwind/base.js"),
  },
};
