// craco.config.js
const path = require("path");

module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      // Fix dynamic import() issue
      webpackConfig.output.environment = {
        ...webpackConfig.output.environment,
        dynamicImport: true,
      };

      // Add fallback for some Node modules if needed
      webpackConfig.resolve.fallback = {
        ...webpackConfig.resolve.fallback,
        fs: false,
        path: require.resolve("path-browserify"),
      };

      // Optional: ensure Babel transpiles ESM dependencies in node_modules
      webpackConfig.module.rules.push({
        test: /\.js$/,
        include: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env", "@babel/preset-react"],
          },
        },
      });

      return webpackConfig;
    },
  },
};
