(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  dModule.define("tile-engine", function() {
    var TileEngine;
    return TileEngine = (function() {
      function TileEngine() {
        this.drawTile = __bind(this.drawTile, this);
        this.drawTiles = __bind(this.drawTiles, this);
        this.drawAsciiMap = __bind(this.drawAsciiMap, this);
        this.defineAsciiTiles = __bind(this.defineAsciiTiles, this);
        this.splitUpImageData = __bind(this.splitUpImageData, this);
        this.splitUpSprites = __bind(this.splitUpSprites, this);
        this.resetCanvas = __bind(this.resetCanvas, this);
        this.loadImage = __bind(this.loadImage, this);        this.sprites = [];
        this.canvas = document.createElement("canvas");
        this.ctx = this.canvas.getContext("2d");
        this.tileWidth = 16;
        this.displayWidthInTiles = 20;
        this.displayHeightInTiles = 20;
      }
      TileEngine.prototype.loadImage = function(src, cb) {
        this.spritesImage = new Image();
        this.spritesImage.src = src;
        return this.spritesImage.onload = __bind(function() {
          this.splitUpSprites();
          this.resetCanvas();
          return typeof cb === "function" ? cb(null) : void 0;
        }, this);
      };
      TileEngine.prototype.resetCanvas = function() {
        this.canvas.width = this.displayWidthInTiles * this.tileWidth;
        this.canvas.height = this.displayHeightInTiles * this.tileWidth;
        return this.ctx = this.canvas.getContext("2d");
      };
      TileEngine.prototype.splitUpSprites = function() {
        this.canvas.width = this.spritesImage.width;
        this.canvas.height = this.spritesImage.height;
        this.ctx = this.canvas.getContext('2d');
        this.ctx.drawImage(this.spritesImage, 0, 0);
        return this.splitUpImageData();
      };
      TileEngine.prototype.splitUpImageData = function() {
        var h, i, spritesImageTileHeight, spritesImageTileWidth, w, _results;
        i = 0;
        this.sprites = [];
        spritesImageTileWidth = this.spritesImage.width / this.tileWidth;
        spritesImageTileHeight = this.spritesImage.height / this.tileWidth;
        _results = [];
        for (h = 0; 0 <= spritesImageTileHeight ? h < spritesImageTileHeight : h > spritesImageTileHeight; 0 <= spritesImageTileHeight ? h++ : h--) {
          _results.push((function() {
            var _results2;
            _results2 = [];
            for (w = 0; 0 <= spritesImageTileWidth ? w < spritesImageTileWidth : w > spritesImageTileWidth; 0 <= spritesImageTileWidth ? w++ : w--) {
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
      TileEngine.prototype.drawAsciiMap = function(str) {
        var chr, i, tiles, _ref;
        tiles = [];
        str = str.replace(/[\n\r]/g, "");
        for (i = 0, _ref = str.length; 0 <= _ref ? i < _ref : i > _ref; 0 <= _ref ? i++ : i--) {
          chr = str[i];
          tiles.push(this.asciiDefinitions[chr]);
        }
        return this.drawTiles(0, tiles);
      };
      TileEngine.prototype.drawTiles = function(index, tiles) {
        var i, tile, _ref, _results;
        _results = [];
        for (i = 0, _ref = tiles.length; 0 <= _ref ? i < _ref : i > _ref; 0 <= _ref ? i++ : i--) {
          tile = tiles[i];
          _results.push(this.drawTile(index + i, tile));
        }
        return _results;
      };
      TileEngine.prototype.drawTile = function(index, tileIndex) {
        var x, y;
        x = (index % this.displayWidthInTiles) * this.tileWidth;
        y = (Math.floor(index / this.displayWidthInTiles)) * this.tileWidth;
        return this.ctx.putImageData(this.sprites[tileIndex], x, y);
      };
      return TileEngine;
    })();
  });
}).call(this);
