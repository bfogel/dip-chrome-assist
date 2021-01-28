import * as webpack from 'webpack';

import CopyPlugin from 'copy-webpack-plugin';
import ExtensionReloader from 'webpack-extension-reloader';

  
const config: webpack.Configuration = {

    entry: {
        'background': './src/background.ts',
        'DipAssistTimeRemaining': './src/DipAssistTimeRemaining.ts',
        'DipAssistAlertManager': './src/DipAssistAlertManager.ts',
        'popup': './src/popup.ts',
        'content': './src/content.ts'
    },

    output: {
        path: `${__dirname}/dist/`,
        publicPath: '/dist/',
        filename: './[name].js'
    },

    resolve: {
        extensions: ['.js', '.ts']
    },

    module: {
        rules: [
            {
                test: /\.ts?$/,
                loader: 'ts-loader'
            }
        ]
    },

    plugins: [
        new CopyPlugin([
            { from: 'manifest.json' },
            { from: 'src/popup.html' },
            { from: 'img' , to: 'img'}
        ])
        ,
        new (ExtensionReloader as any)({
            port: 9090,
            reloadPage: true,
            entries: {
                background: 'background',
                contentScript: ['DipAssistTimeRemaining','DipAssistAlertManager','content', 'popup']
            }
        })
    ]
};

export default config;
