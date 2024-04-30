const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

const config = {
  images: {
    domains: [
      "i.scdn.co",
      "pbs.twimg.com",
      "cdn.sanity.io",
      "lh3.googleusercontent.com",
    ],
  },
  reactStrictMode: true,
  pageExtensions: ["jsx", "js", "tsx", "ts"],
  transpilePackages: ["react-tweet"],
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    config.plugins.push(
      new webpack.DefinePlugin({
        IN_BROWSER: true,
      })
    );
    return config;
  },
};

module.exports = withBundleAnalyzer(config);
