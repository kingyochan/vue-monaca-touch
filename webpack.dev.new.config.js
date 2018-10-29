try {
  var path = require('path');

  var webpack = require('webpack');
  var HtmlWebpackPlugin = require('html-webpack-plugin');
  var ExtractTextPlugin = require('extract-text-webpack-plugin');
  var ProgressBarPlugin = require('progress-bar-webpack-plugin');

  var cssnext = require('postcss-cssnext');
  var postcssImport = require('postcss-import');
  var postcssUrl = require('postcss-url');

} catch (e) {
  throw new Error('Missing Webpack Build Dependencies.');
}

module.exports = {
  devtool: 'inline-source-map',
  context: __dirname,
  debug: true,
  cache: true,

  entry: {
    watch: ['webpack/hot/only-dev-server'],
    app: ['./src/main'],
    vendor: ['vue']
  },

  output: {
    path: path.join(__dirname, 'www'),
    filename: '[name].bundle.js',
    chunkFilename: '[name].chunk.js',
    publicPath: '/'
  },

  resolve: {
    root: [
      path.join(__dirname, 'src'),
      path.join(__dirname, 'node_modules')
    ],

    extensions: ['', '.js', '.vue', '.json', '.css', '.html', '.styl'],

    unsafeCache: true,

    alias: {
      vue:'vue/dist/vue.common.js'
    }
  },

  module: {
    loaders: [{
      test: /\.vue$/,
      loader: 'vue-loader'
    }, {
      test: /\.js$/,
      loader: 'babel',
      exclude: /node_modules/
    }, {
      test: /\.html$/,
      loader: 'html'
    }, {
      test: /\.(png|jpe?g|gif|svg|woff|woff2|ttf|eot|ico)(\?\S*)?$/,
      loader: 'file?name=assets/[name].[hash].[ext]'
    }, {
      test: /\.css$/,
      include: [
        path.join(__dirname, 'node_modules', 'onsenui', 'css-components-src', 'src'),
        path.join(__dirname, 'src')
      ],
      loader: ExtractTextPlugin.extract('style', 'css?importLoaders=1&-raw!postcss-loader')
    }, {
      test: /\.css$/,
      exclude: [
        path.join(__dirname, 'node_modules', 'onsenui', 'css-components-src', 'src'),
        path.join(__dirname, 'src')
      ],
      loader: ExtractTextPlugin.extract('style', 'css?sourceMap')
    }, {
      test: /\.json$/,
      loader: 'json'
    }]
  },

  vue: {
    loaders: {
      js: 'babel'
    }
  },

  babel: {
    presets: [
      'babel-preset-es2015'
    ],
  },

  postcss: function() {
    return [
      postcssImport,
      postcssUrl,
      cssnext({
        browsers: ['> 1%', 'last 2 versions', 'Firefox ESR', 'Opera 12.1']
      })
    ]
  },

  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.optimize.CommonsChunkPlugin({
      name: ['app', 'vendor']
    }),
    new ExtractTextPlugin('[name].css'),
    new HtmlWebpackPlugin({
      template: 'src/public/index.html.ejs',
      chunksSortMode: 'dependency'
    }),
    new ProgressBarPlugin()
  ],

  resolveLoader: {
    root: [
      path.join(__dirname, 'node_modules')
    ]
  },

  devServer: {
    contentBase: './src/public',
    colors: true,
    inline: true,
    historyApiFallback: true,
    host: '0.0.0.0',
    stats: 'minimal',
    hot: true
  }
};
