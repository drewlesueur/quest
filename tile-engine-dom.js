(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  dModule.define("tile-engine-dom", function() {
    var TileEngine;
    return TileEngine = (function() {

      function TileEngine() {
        this.drawTile = __bind(this.drawTile, this);
        this.drawTiles = __bind(this.drawTiles, this);
        this.drawAsciiMap = __bind(this.drawAsciiMap, this);
        this.defineAsciiTiles = __bind(this.defineAsciiTiles, this);
        this.makeDiv = __bind(this.makeDiv, this);
        this.addTile = __bind(this.addTile, this);
        this.setTiles = __bind(this.setTiles, this);
        this.loadImage = __bind(this.loadImage, this);        this.sprites = [];
        this.canvas = document.createElement("div");
        this.tileWidth = 16;
        this.displayWidthInTiles = 20;
        this.displayHeightInTiles = 20;
        this.spritesImageWidth = 160;
        this.canvas.style.width = this.displayWidthInTiles * this.tileWidth + "px";
        this.canvas.style.height = this.displayHeightInTiles * this.tileWidth + "px";
        this.canvas.style.position = "relative";
        this.tiles = [];
      }

      TileEngine.prototype.loadImage = function(src, cb) {
        var onload;
        var _this = this;
        if (cb == null) cb = function() {};
        this.spritesImage = {
          src: src
        };
        this.spritesImage.src = src;
        onload = function() {
          _this.setTiles();
          _this["do"];
          return cb(null);
        };
        onload();
        return onload;
      };

      TileEngine.prototype.setTiles = function() {
        var i, numberOfTiles, _results;
        this.tiles = [];
        numberOfTiles = this.displayWidthInTiles * this.displayHeightInTiles;
        _results = [];
        for (i = 0; 0 <= numberOfTiles ? i < numberOfTiles : i > numberOfTiles; 0 <= numberOfTiles ? i++ : i--) {
          _results.push(this.addTile());
        }
        return _results;
      };

      TileEngine.prototype.addTile = function() {
        var tile;
        tile = this.makeDiv();
        tile.style.left = (this.tiles.length % this.displayWidthInTiles) * this.tileWidth + "px";
        tile.style.top = Math.floor(this.tiles.length / this.displayWidthInTiles) * this.tileWidth + "px";
        tile.style.width = this.tileWidth + "px";
        tile.style.height = this.tileWidth + "px";
        tile.style.backgroundImage = "url(" + this.spritesImage.src + ")";
        tile.style.position = "absolute";
        tile.style.overflow = "hidden";
        this.tiles.push(tile);
        return this.canvas.appendChild(tile);
      };

      TileEngine.prototype.makeDiv = function() {
        return document.createElement("div");
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
        x = (tileIndex % this.spritesImageWidth) * this.tileWidth;
        y = (Math.floor(tileIndex / this.spritesImageWidth)) * this.tileWidth;
        return this.tiles[index].style.backgroundPosition = "-" + x + "px -" + y + "px";
      };

      return TileEngine;

    })();
  });

}).call(this);
