const ExtractTextPlugin = require('extract-text-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const htmlWebpackTemplate = require('html-webpack-template')
const path = require('path')
const postcss = require('postcss')
const postcssCssnext = require('postcss-cssnext')
const postcssImport = require('postcss-import')

const port = process.env.PORT || 3000
const isProd = process.env.NODE_ENV === 'production'

const src = path.resolve('src')

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
        // exclude: /node_modules/
        include: [src]
      },
      {
        test: /\.(html|svelte)$/,
        include: [src],
        // exclude: /node_modules/,
        use: [
          {
            loader: 'svelte-loader',
            options: {
              // emitCss: true,
              style: ({ content, attributes, filename }) => {
                // return
                return postcss([
                  postcssImport(),
                  postcssCssnext({
                    browsers: ['Last 2 versions', 'IE >= 10']
                  })
                ])
                  .process(
                    content,
                    { from: filename, to: filename }
                    // { from: path.dirname(filename) }
                  )
                  .then(result => {
                    console.log('result', result)
                    return { code: result.css, map: null }
                  })
                  .catch(err => {
                    console.log('failed to preprocess style', err)
                    return
                  })
              }
            }
          }
        ]
      },
      {
        test: /\.css$/,
        // NOTE: Have to have /private svelte compilation directories available for css loading abs paths?!
        // include: [path.resolve('src')],
        exclude: /node_modules/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              options: { modules: true, sourceMap: true }
            },
            {
              loader: 'postcss-loader',
              options: {
                plugins: [
                  postcssImport({
                    addModulesDirectories: [
                      path.resolve(path.join(__dirname, 'node_modules'))
                    ]
                  }),
                  postcssCssnext
                ]
              }
            }
          ]
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
