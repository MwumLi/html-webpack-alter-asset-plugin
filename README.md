# html-webpack-alter-asset-plugin
Allow plugins to make changes to the assets before invoking the template when using [html-webpack-plugin](https://github.com/ampedandwired/html-webpack-plugin)


## Introduce  

In some case, we want to make some changes to static resources(js and css) before inserting it into the output file, such as:  
* spectify the order of js and css, it cann't meet our expectations to use the option `chunksSortMode` from html-webpack-plugin  
* Insert additional static resources, which not introduced in the webpack  
...  

Based on the above requirements, I finished it!  


## Installation 

You must be running webpack on node 4.3 or higher  

Install the plugin with npm:  

    $ npm install --save-dev html-webpack-alter-asset-plugin

## Basic Usage  

webpack.config.js :  

    "use strict";
    let HtmlWebpackPlugin = require('html-webpack-plugin');
    let htmlWebpackAlterAssetPlugin = require('html-webpack-alter-asset-plugin');

    ...

    module.exports = {
        entry: {
            "vendor": path.resolve(BASE_PATH, 'vendor.browser.js'),
            "polyfills": path.resolve(BASE_PATH, 'polyfills.browser.js'),
            "app": path.resolve(BASE_PATH, 'app.js'),
            "style": path.resolve(BASE_PATH, 'style.js'),
            "vnc": path.resolve(BASE_PATH, 'vnc.js'),
            "register": path.resolve(BASE_PATH, 'register.js'),
        },
        ...
        plugins: {
            new HtmlWebpackPlugin({
                template: './src/app/app.html',
                filename: 'tpl/index.html',
                injectAlter: {
                    js: { 
                        keys: [ '~/system.json', 'commons', 'vendor', 'style', 'polyfills', 'app' ] 
                    }
                }
            }),
            new htmlWebpackAlterAssetPlugin()
        }
        ...
    }

After run webpack, `<script>` tag is below  in the ouput html `tpl/index.html`:  

    <html>
    <head>
        ...
    </head>
    <body>
      <app></app>
    <script type="text/javascript" src="/system.json"></script><script type="text/javascript" src="/js/commons.js"></script><script type="text/javascript" src="/js/vendor.74c00f920eb335778ae2.bundle.js"></script><script type="text/javascript" src="/js/style.c3f0123e2b41041085f1.bundle.js"></script><script type="text/javascript" src="/js/polyfills.9c2975cfe87c0377bcb4.bundle.js"></script><script type="text/javascript" src="/js/app.b8673988fc2be4df9059.bundle.js"></script></body>

    </html>


changes :  

1. `~/system.json` into `/system.json`, so `<script>` tag is:  


        <script type="text/javascript" src="/system.json">

2.the order of js is based on `injectAlter.js.keys`  


## Options  


### html-webpack-plugin

`injectAlter` for html-webpack-plugin  

1. the default :  sort static assets and insert additional static resources (such as `~/system.json`)  
2.  the orders of js and css will depend on `injectAlter.js.keys` and `injectAlter.css.keys` separately  
3. if define `injectAlter.js.func`, so call `injectAlter.js.func()` deal js, the same as css  
   `injectAlter.js.func` refer to [HtmlWebpackAlterAssetPlugin.prototype.alterAsset](https://github.com/MwumLi/html-webpack-alter-asset-plugin/blob/master/index.js#L21)

4. `html-webpack-alter-asset-plugin` deal assets after `chunks`, `excludeChunks` from `html-webpack-plugin`, which means assets include `chunks` and  skip some chunks from `excludeChunks`  

the whole `injectAlter` :  

        injectAlter : {
            js : {
                keys: ['~/system.json', 'common', 'polyfills', 'app'],
                func: jsInjectAlterFunc
            }
        }


## Contribution

You're free to contribute to this project by submitting [issues][issues] and/or [pull requests][requests].   

[issues]: https://github.com/MwumLi/html-webpack-alter-asset-plugin/issues
[requests]: https://github.com/MwumLi/html-webpack-alter-asset-plugin/pulls

## License

This project is licensed under [MIT](https://github.com/MwumLi/html-webpack-alter-asset-plugin/blob/master/LICENSE).  
