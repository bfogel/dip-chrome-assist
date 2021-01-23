const CopyPlugin = require('copy-webpack-plugin');
const ChromeExtensionReloader = require('webpack-chrome-extension-reloader');

module.exports = {
    entry: {
        'background': './background.js',
        'content': './content.js',
    },

    output: {
        path: `${__dirname}/dist/`,
        publicPath: '/dist/',
        filename: './[name].js'
    },

    resolve: {
        extensions: ['.js']
    },

    plugins: [
        new CopyPlugin([
            { from: 'manifest.json' }
        ]),
        new ChromeExtensionReloader({
            port: 9090,
            reloadPage: true,
            entries: {
                background: 'background',
                contentScript: ['content']
            }
        })
    ],
};
