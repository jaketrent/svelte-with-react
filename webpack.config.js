const ExtractTextPlugin = require('extract-text-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const htmlWebpackTemplate = require('html-webpack-template')
const path = require('path')

const port = process.env.PORT || 3000
const isProd = process.env.NODE_ENV === 'production'

module.exports = {
  devtool: 'source-map',
  entry: path.resolve(path.join('src', 'index.js')),
  output: {
    path: path.resolve('dist'),
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: ['babel-loader'],
        include: [path.resolve('src')]
      },
      {
        test: /\.(html|svelte)$/,
        include: [path.resolve('src')],
        use: {
          loader: 'svelte-loader',
          options: {
            emitCss: true
          }
        }
      },
      {
        test: /\.css$/,
        include: [path.resolve('src')],
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [{ loader: 'css-loader', options: { sourceMap: true } }]
        })
      }
    ]
  },
  plugins: [
    new ExtractTextPlugin('styles.css'),
    new HtmlWebpackPlugin({
      inject: false,
      template: htmlWebpackTemplate,
      appMountId: 'app',
      title: 'Svelte with React',
      devServer: isProd && `http://localhost:${port}`,
      mobile: true
    })
  ],
  devServer: {
    port,
    stats: 'minimal'
  }
}
