require('dotenv').config();
require('enve');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const WebappWebpackPlugin = require('webapp-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const { version } = require('./package.json');
const webpack = require('webpack');
const path = require('path');

const PROD = process.enve.NODE_ENV == 'production';

module.exports = {
  mode: process.enve.NODE_ENV,

  entry: {
    app: './lib/app/index.ts',
    sw: './lib/app/sw.ts'
  },

  output: {
    globalObject: 'this',
    publicPath: '/static/',
    filename: chunkData =>
      chunkData.chunk.name === 'sw' ? 'sw.js' : '[name].[hash].js',
    pathinfo: false,
    path: path.resolve(__dirname, 'dist')
  },

  resolve: {
    alias: {
      'react-dom': '@hot-loader/react-dom'
    },
    modules: [__dirname, 'node_modules'],
    extensions: ['.ts', '.tsx', '.js', '.jsx']
  },

  module: {
    rules: [
      {
        test: /sw\.js$/,
        loader: 'babel-loader',
        include: [path.resolve(__dirname, 'lib')],
        exclude: /node_modules/,
        options: {
          presets: [
            '@babel/preset-typescript',
            [
              '@babel/preset-env',
              {
                targets: {
                  browsers: [
                    'last 2 Chrome versions',
                    'last 2 Firefox versions'
                    // 'last 1 iOS versions',
                    // 'last 1 Android versions'
                  ]
                }
              }
            ]
          ]
        }
      },
      {
        test: /\.(js|jsx|ts|tsx)$/,
        loader: 'babel-loader',
        include: [
          path.resolve(__dirname, 'components'),
          path.resolve(__dirname, 'constants'),
          path.resolve(__dirname, 'lib')
        ],
        exclude: /node_modules|sw\.js/,
        options: {
          presets: [
            ['@babel/preset-typescript', { isTSX: true, allExtensions: true }],
            [
              '@babel/preset-env',
              {
                targets: {
                  browsers: [
                    'last 2 Chrome versions',
                    'last 2 Firefox versions'
                    // 'last 1 iOS versions',
                    // 'last 1 Android versions'
                  ]
                }
              }
            ],
            '@babel/preset-react'
          ],
          plugins: [
            '@babel/plugin-proposal-class-properties',
            'react-hot-loader/babel'
          ]
        }
      },
      { test: /\.css$/, use: ['style-loader', 'css-loader'] },
      {
        test: /\.(png|jpg|woff|woff2|eot|ttf|svg)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              publicPath: '/static',
              name: '[name].[hash].[ext]'
            }
          }
        ]
      }
    ]
  },

  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.enve.NODE_ENV),
      'process.enve': Object.entries(process.enve).reduce((o, [k, v]) => {
        o[k] = JSON.stringify(v);
        return o;
      }, {})
    }),
    new CleanWebpackPlugin({
      cleanAfterEveryBuildPatterns: ['**/*', '!manifest.json']
    }),
    new HtmlWebpackPlugin({
      excludeChunks: ['sw'],
      template: 'template.html'
    }),
    new WebappWebpackPlugin({
      favicons: {
        appleStatusBarStyle: 'default',
        appDescription: 'Read smarter.',
        developerName: 'Xyfir, LLC',
        developerURL: 'https://www.xyfir.com',
        appShortName: 'Insightful',
        theme_color: '#1976d2',
        background: '#fafafa',
        start_url: '/',
        version,
        appName: 'Insightful',
        display: 'standalone',
        icons: {
          appleStartup: false,
          appleIcon: true,
          favicons: true,
          android: true,
          firefox: true,
          windows: false,
          yandex: false,
          coast: false
        },
        lang: 'en-US',
        dir: 'ltr'
      },
      inject: true,
      prefix: '',
      cache: true,
      logo: './icon.png'
    }),
    PROD ? new CompressionPlugin({ filename: '[path].gz' }) : null,
    PROD ? null : new webpack.HotModuleReplacementPlugin(),
    new ManifestPlugin({ fileName: 'webpack.json' })
  ].filter(p => p !== null),

  devtool: PROD ? false : 'inline-source-map',

  watchOptions: {
    aggregateTimeout: 500,
    ignored: ['node_modules', 'dist']
  },

  devServer: {
    historyApiFallback: true,
    /** @todo remove this eventually */
    disableHostCheck: true,
    contentBase: path.join(__dirname, 'dist'),
    writeToDisk: true,
    port: process.enve.DEV_SERVER_PORT,
    hot: true
  }
};
