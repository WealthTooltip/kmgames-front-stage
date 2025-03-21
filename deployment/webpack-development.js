/*
 * @Author: Passion.KMG
 * @Date: 2023-12-13
 * @LastEditors: Passion.KMG jspassion@itcom888.com
 * @FilePath: /KMG/deployment/webpack-development.js
 * @Description: 开发环境
 */
const _ = require('lodash');
const ESLintPlugin = require('eslint-webpack-plugin')
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const webpackLoader = require('./projects.config');
const path = require('path');
makeConf = require('./dynamicTsconfig');

module.exports = (env) => {
  const CONFIG = webpackLoader(
    env.alias.split('-')[0],
    env.alias.split('-')[1]
  );
  makeConf({myPath: CONFIG.base, client: CONFIG.client});
  return {
    entry: {
      bootstrap: `./src/views/${CONFIG.base}/assets/bootstrap.ts`,
      index: `./src/views/${CONFIG.entry}/index.tsx`,
      live: `./src/views/${CONFIG.base}/public/LiveFrame/index.tsx`
    },
    output: {
      filename: `${CONFIG.entry}/javascript/[name].[hash:4].js`,
      path: CONFIG.buildPath,
      publicPath: '/',
      chunkFilename: `${CONFIG.entry}/javascript/chunk.[name].[chunkhash:4].js`
    },
    plugins: [
      new HtmlWebpackPlugin({
        title: `${CONFIG.name}`,
        mode: 'dev',
        meta: CONFIG.client === 'mobile' ? {
          'viewport': 'width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=0',
          'cache': { name: 'cache-control', content: `${env.cachev}-${env.cachec}` }
        } : {
          'cache': { name: 'cache-control', content: `${env.cachev}-${env.cachec}` }
        },
        filename: `index.html`,
        template: `src/views/${CONFIG.base}/assets/index.ejs`,
        chunks: ['vendor', 'index', 'bootstrap'],
        favicon: `src/views/${CONFIG.base}/assets/images/favicon.ico`
      }),
      new HtmlWebpackPlugin({
        title: `${CONFIG.name}`,
        mode: 'dev',
        meta: CONFIG.client === 'mobile' ? {
          'viewport': 'width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=0',
          'cache': { name: 'cache-control', content: `${env.cachev}-${env.cachec}` }
        } : {
          'cache': { name: 'cache-control', content: `${env.cachev}-${env.cachec}` }
        },
        filename: `live.html`,
        template: `src/views/${CONFIG.base}/public/LiveFrame/index.ejs`,
        chunks: [ 'live'],
        favicon: `src/views/${CONFIG.base}/assets/images/favicon.ico`
      }),
      new MiniCssExtractPlugin({
        filename: `${CONFIG.entry}/styles/[name].[hash:4].css`,
        chunkFilename: `${CONFIG.entry}/styles/[id].[hash].css`
      }),
      new webpack.ProvidePlugin({
        'window.$I18N_FILE': [path.resolve(__dirname, `../src/views/${CONFIG.base}/assets/language/index`), 'default'],
        _: 'lodash',
        React: 'react',
        ReactDom: 'react-dom',
      }),
      new webpack.DefinePlugin({
        '__DEV_MODE__': true,
        '__DB_VERSION__': _.now(),
        'process.env.PLATFORM': `"${CONFIG.base}"`,
        'process.env.CLIENT_MODE': `"${CONFIG.client}"`,
        'process.env.DOMAIN': `"/"`,
        'process.env.PLATFORM_NAME': `"${CONFIG.name}"`,
        'process.env.API_PREFIX': `"${CONFIG.apiVersion}"`
      }),
      new ESLintPlugin({
        extensions: ['ts', 'tsx'],
        files: ['src/**/*.ts', 'src/**/*.tsx'],
      }),
    ],
    // externals: {
    //   'react': 'React',
    //   'react-dom': 'ReactDOM',
    //   'lodash': '_',
    //   'jsencrypt': 'JSEncrypt',
    //   'axios': 'axios',
    //   'preact': 'preact'
    // },
    module: {
      rules: [
        {
          test: /\.m?js/,
          resolve: {
            fullySpecified: false
          }
        },
        {
          test: /\.js[x]?$/,
          resolve: {
            fullySpecified: false,
          },
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env'],
            },
          },
          include: /src/,
          exclude: /node_modules/
        },
        {
          test: /\.ts[x]?$/,
          use: ['ts-loader'],
          include: /src/,
          resolve: {
            fullySpecified: false,
          },
          exclude: /node_modules/
        },
        {
          test: /\.(scss|css)$/,
          use: CONFIG.client === 'mobile' ?
          [
            MiniCssExtractPlugin.loader,
            {
              loader: 'css-loader',
              options: {
                modules: 'global',
              }
            },
            {
              loader: 'postcss-loader'
            },
            {
              loader: 'sass-loader',
            }
          ]
          :
          [
            MiniCssExtractPlugin.loader,
            {
              loader: 'css-loader',
              options: {
                modules: 'global',
              }
            },
            {
              loader: 'sass-loader',
            }
          ]
        },
        {
          test: /\.(jpg|jpe?g|png|webp|gif|mp4)$/,
          use: [
            {
              loader: 'url-loader',
              options: {
                limit: 4196,
                esModule: false,
                outputPath: `${CONFIG.entry}/images/`,
                name: '[name].[hash:4].[ext]'
              }
            }
          ],
          type: 'javascript/auto',
          exclude: path.join(__dirname, `../src/views/${CONFIG.base}/public/i/`)
        },
        {
          test: /\.(jpg|jpe?g|png|gif)$/,
          use: [
            {
              loader: 'url-loader',
              options: {
                limit: 1024,
                esModule: false,
                outputPath: `${CONFIG.entry}/images/`,
                name: '[name].[hash:4].[ext]'
              }
            }
          ],
          type: 'javascript/auto',
          include: path.join(__dirname, `../src/views/${CONFIG.base}/public/i/`)
        },
        {
          test: /\.(mp3|wav)$/,
          use: [
            {
              loader: 'url-loader',
              options: {
                outputPath: `${CONFIG.entry}/media`,
                esModule: false,
                name: '[name].[hash:4].[ext]'
              }
            }
          ],
          type: 'javascript/auto',
        },
        {
          test: /\.(htm|html)$/,
          use: 'html-withimg-loader'
        },
        {
          test: /\.(svg)$/,
          use: [
            {
              loader: 'file-loader',
              options: {
                outputPath: `${CONFIG.entry}/svg`,
                name: '[name].[hash:4].[ext]',
                esModule: false
              }
            }
          ],
          type: 'javascript/auto',
        },
        {
          test: /\.(woff|woff2|eot|ttf|otf)$/,
          use: [
            {
              loader: 'file-loader',
              options: {
                outputPath: `${CONFIG.entry}/fonts`,
                name: '[name].[hash:4].[ext]',
                esModule: false
              }
            }
          ],
          type: 'javascript/auto',
        }
      ]
    },
    devServer: {
      host: '0.0.0.0',
      port: 8087,
      hot: false,
      allowedHosts: 'all',
      historyApiFallback:true,
      client: {
        overlay: true
      },
      proxy: {
        [`/kmg/**`]: {
          target: CONFIG.api.local,
          secure: false,
          changeOrigin: true
        },
        [`/api/**`]: {
          target: CONFIG.api.fat,
          secure: false,
          changeOrigin: true
        },
        [`/toout/**`]: {
          target: CONFIG.api.local,
          secure: false,
          changeOrigin: true
        },
      }
    },
    resolve: {
      extensions: ['.js', '.jsx', '.json', '.css', '.scss', '.tsx', '.ts', 'svg', 'png', 'otf'],
      fullySpecified: false,
      alias: {
        '@': path.join(__dirname, '../src'),
        '@core': path.join(__dirname, '../src/core'),
        '@views': path.join(__dirname, '../src/views'),
        '@template': path.join(__dirname, `../src/core/templates/${CONFIG.client}`),
        '@configs': path.join(__dirname, '../src/core/constants/configs'),
        '@helpers': path.join(__dirname, '../src/core/helpers'),
        '@constants': path.join(__dirname, '../src/core/constants'),
        '@actions': path.join(__dirname, '../src/core/actions'),
        '@schemas': path.join(__dirname, '../src/core/schemas'),
        '@libs': path.join(__dirname, '../src/core/libs'),
        '@hooks': path.join(__dirname, '../src/core/hooks'),
        '@models': path.join(__dirname, '../src/core/apis/models'),
        "@mocks": path.join(__dirname, `../src/views/${CONFIG.base}/assets/mock`),
        '@style': path.join(
          __dirname,
          `../src/core/templates/${CONFIG.client}/styles`
        ),
        '@my': path.join(__dirname, `../src/views/${CONFIG.base}`),
        '@this': path.join(__dirname, `../src/views/${CONFIG.base}/${CONFIG.client}`),
        'moment': 'dayjs'
      }
    },
    devtool: 'inline-source-map'
  }
};
