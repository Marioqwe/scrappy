const path = require('path');
const webpack = require('webpack');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const S3Plugin = require('webpack-s3-plugin');

const CSS_RULE = {
    test: /\.(sa|sc|c)ss$/,
    use: [
        MiniCssExtractPlugin.loader,
        'css-loader',
        'sass-loader',
    ],
};

const JS_RULES = {
    test: /\.js$/,
    exclude: /node_modules/,
    use: [
        'babel-loader',
    ],
};

const RULES = [
    JS_RULES,
    CSS_RULE,
];

const PLUGINS = [
    new HtmlWebPackPlugin({
        template: './index.html',
    }),
    new MiniCssExtractPlugin({
        filename: './build/css/main.css',
    }),
    new webpack.DefinePlugin({
        'process.env': {
            NODE_ENV: JSON.stringify('production'),
        },
    }),
    new CompressionPlugin({
        test: /\.(js)$/,
        filename: '[path].gz[query]',
        algorithm: 'gzip',
        deleteOriginalAssets: true,
    }),
    new S3Plugin({
        s3Options: {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
            region: process.env.AWS_S3_REGION_NAME,
        },
        s3UploadOptions: {
            Bucket: process.env.AWS_STORAGE_BUCKET_NAME,
            ContentEncoding(fileName) {
                if (/\.gz/.test(fileName)) {
                    return 'gzip';
                }
            },
        },
        basePath: 'static',
        directory: './prod',
    }),
];

module.exports = {
    mode: 'production',
    context: path.join(__dirname, '../'),
    entry: {
        main: [
            './src/index.js',
        ],
    },
    output: {
        path: path.join(__dirname, '../prod'),
        filename: './build/js/main.js',
    },
    module: {
        rules: RULES,
    },
    resolve: {
        extensions: ['.js'],
        modules: [
            './src',
            './node_modules',
        ],
    },
    plugins: PLUGINS,
    optimization: {
        minimizer: [
            new UglifyJsPlugin({
                cache: true,
                parallel: true,
                sourceMap: true,
            }),
            new OptimizeCSSAssetsPlugin({}),
        ],
    },
};
