module.exports = {
  webpack: {
    configure: {
      ignoreWarnings: [
        {
          module: /@walletconnect/,
          message: /Failed to parse source map/,
        },
      ],
    },
  },
}; 