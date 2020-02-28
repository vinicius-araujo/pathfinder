const path = require('path');

module.exports = {
  entry: {
      app: './src/app.ts'
  },
    devServer: {
        contentBase: './dist/',
        hot: true
    },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules : [
        {
            test: /\.css$/,
            use: ['style-loader','css-loader']
        },
        {
            test: /\.ts$/,
            use: 'ts-loader',
            exclude: /node_modules/
        },
    ]
  },
  resolve: {
    extensions: ['.ts', '.js' ],
  }
};