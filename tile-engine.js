(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  dModule.define("tile-engine", function() {
    var TileEngine;
    return TileEngine = (function() {
      function TileEngine() {
        this.defineAsciiTiles = __bind(this.defineAsciiTiles, this);
        this.splitUpImageData = __bind(this.splitUpImageData, this);
        this.splitUpSprites = __bind(this.splitUpSprites, this);
        this.imageLoaded = __bind(this.imageLoaded, this);
        this.loadImage = __bind(this.loadImage, this);        this.sprites = [];
        this.canvas = document.createElement("canvas");
        this.ctx = this.canvas.getContext("2d");
      }
      TileEngine.prototype.loadImage = function(src) {
        this.spritesImage = new Image();
        this.spritesImage.src = src;
        return this.spritesImage.onload = this.splitUpSprites;
      };
      TileEngine.prototype.imageLoaded = function() {};
      TileEngine.prototype.splitUpSprites = function() {
        this.canvas.width = this.spritesImage.width;
        this.canvas.height = this.spritesImage.height;
        this.ctx = this.canvas.getContext('2d');
        this.ctx.drawImage(this.spritesImage, 0, 0);
        return this.splitUpImageData();
      };
      TileEngine.prototype.splitUpImageData = function() {
        var h, i, spritesImageTileHeight, spritesImageTileWidth, tileWidth, w, _results;
        i = 0;
        this.sprites = [];
        tileWidth = 16;
        spritesImageTileWidth = this.spritesImage.width / tileWidth;
        spritesImageTileHeight = this.spritesImage.height / tileWidth;
        console.log(spritesImageTileWidth, spritesImageTileHeight);
        _results = [];
        for (w = 0; 0 <= spritesImageTileWidth ? w < spritesImageTileWidth : w > spritesImageTileWidth; 0 <= spritesImageTileWidth ? w++ : w--) {
          _results.push((function() {
            var _results2;
            _results2 = [];
            for (h = 0; 0 <= spritesImageTileHeight ? h < spritesImageTileHeight : h > spritesImageTileHeight; 0 <= spritesImageTileHeight ? h++ : h--) {
              this.sprites[i] = this.ctx.getImageData(w * 16, h * 16, 16, 16);
              _results2.push(i += 1);
            }
            return _results2;
          }).call(this));
        }
        return _results;
      };
      TileEngine.prototype.defineAsciiTiles = function(text) {
        var chr, i, _ref, _results;
        this.asciiDefinitions = {};
        text = text.replace(/[\n\r]/g, "");
        _results = [];
        for (i = 0, _ref = text.length; 0 <= _ref ? i < _ref : i > _ref; 0 <= _ref ? i++ : i--) {
          chr = text[i];
          _results.push(this.asciiDefinitions[chr] = i);
        }
        return _results;
      };
      return TileEngine;
    })();
  });
}).call(this);
