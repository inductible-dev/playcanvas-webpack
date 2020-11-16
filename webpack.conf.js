const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

const ENV = process.env.NODE_ENV;

var config = {
    entry: [
        './src/app'
    ],
    output: {
        filename: 'app.js'
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            },
            {
                test: /\.m?js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html'
        })
    ]
};

switch (ENV) {
    case "production":
        console.log("--------------- USING production");
        config.output.path = path.resolve(__dirname, 'build-release');
        config.mode = 'production';
        config.optimization = {
            minimize: true,
            minimizer: [new TerserPlugin({
                terserOptions: {
                    format: {
                        comments: false
                    }
                },
                extractComments: false,
            })],
            /*splitChunks: {
                chunks: 'all',
            }*/
        }
        break;
    case "development":
        console.log("--------------- USING development");
        config.mode = 'development';
        config.output.path = path.resolve(__dirname, 'build-debug');
        config.devtool = 'source-map';
        break;
    default:
        console.log("--------------- USING default");
        config.mode = 'development';        
        config.devServer = {
            contentBase: "./static",
        };
        config.devtool = 'source-map';
}

module.exports = config;

