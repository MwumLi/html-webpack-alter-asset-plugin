'use strict';

function HtmlWebpackAlterAssetPlugin (options) {
    this.options = {
        debug: false
    };

    options && Object.assign(this.options, options);
}

HtmlWebpackAlterAssetPlugin.prototype.apply = function (compiler) {
  var self = this;
  // Hook into the html-webpack-plugin processing
  compiler.plugin('compilation', function (compilation) {
    compilation.plugin('html-webpack-plugin-before-html-generation', function (htmlPluginData, callback) {
      self.alterAsset(htmlPluginData, callback);
    });
  });
};

HtmlWebpackAlterAssetPlugin.prototype.alterAsset = function (htmlPluginData, callback) {
    var self = this;

    self.options.debug && self.debugFunc(htmlPluginData);

    var options = htmlPluginData.plugin.options;
    if ( options && options.injectAlter ) {
        var assets = htmlPluginData.assets,
            alterFunc = self.alterFunc;

        for (var key in options.injectAlter) {
            var item = options.injectAlter[key];
            if (item.keys) {
                item.func = item.func? item.func: self.alterFunc;
                assets[key] = item.func(assets[key], item.keys);
            }
        }
    }

    self.options.debug && self.debugFunc(htmlPluginData, true);

    callback();
}


HtmlWebpackAlterAssetPlugin.prototype.alterFunc = function (arrAssets, arrOrders) {
      var arrProcesseds = [];

      for (var i=0; i<arrOrders.length; i++) {

          // Reserved string beginning with ~
          // etc: `~/css/register.css` change to  `/css/register.css`
          if (arrOrders[i].indexOf('~') == 0) {
              arrProcesseds.push(arrOrders[i].slice(1));
              continue;
          }

          var length = arrAssets.length;
          for (var j = 0; j < length;  j++) {
            if (arrAssets[j].indexOf(arrOrders[i]) >= 0) {
                break;
            }
          }

          if (j < length) {
            arrProcesseds.push(arrAssets[j]);
            arrAssets.splice(j,1);    // remove the data has been added to improve the efficiency
          }
      }
      return arrProcesseds;
};

HtmlWebpackAlterAssetPlugin.prototype.debugFunc = function (htmlPluginData, afterDeal) {
    if (!afterDeal) {
        console.log("****************html plugin alter asset start**********************");
        console.log(htmlPluginData.outputName);
    }
    afterDeal && console.log('changed:');
    console.log(htmlPluginData.assets.js);
    console.log(htmlPluginData.assets.css);
    afterDeal && console.log("****************html plugin alter asset end**********************");
};

module.exports = HtmlWebpackAlterAssetPlugin;
