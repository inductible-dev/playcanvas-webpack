const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

const ENV = process.env.NODE_ENV ;

var config = {
    output: {
        filename: 'app.js'
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            favicon: 'src/favicon.png',
            meta: {
                'viewport': 'width=device-width, user-scalable=no, minimum-scale=1, maximum-scale=1'
            },
            title: 'PlayCanvas Webpack Example'
        })
    ]
};

switch(ENV)
{
  case "production":
    console.log("--------------- USING production");
    config.output.path = path.resolve( __dirname, 'build-release' ) ;
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
    }
  break;
  case "development":
    console.log("--------------- USING development");
    config.output.path = path.resolve( __dirname, 'build-debug' ) ;
    config.devtool = 'source-map';
  break;
  default:
    console.log("--------------- USING default");
    config.devtool = 'source-map';
}

module.exports = config;
