(function() {
  describe("TileEngine", function() {
    var TileEngine, tileEngine;
    TileEngine = dModule.require("tile-engine");
    tileEngine = null;
    beforeEach(function() {
      return tileEngine = new TileEngine();
    });
    it("should have a canvas element", function() {
      expect(tileEngine.canvas.constructor).toBe(HTMLCanvasElement);
      return expect(tileEngine.ctx.constructor).toBe(CanvasRenderingContext2D);
    });
    it("should load in an image of all the sprites", function() {
      var loadImageCb, myCb, myCbCalled;
      spyOn(window, "Image").andReturn({
        width: 160,
        height: 160
      });
      myCbCalled = false;
      myCb = function() {
        return myCbCalled = true;
      };
      loadImageCb = tileEngine.loadImage("sprites.png", myCb);
      expect(window.Image).toHaveBeenCalled();
      expect(tileEngine.spritesImage.src).toBe("sprites.png");
      expect(tileEngine.spritesImage.onload).toBe(loadImageCb);
      spyOn(tileEngine.ctx, "drawImage");
      spyOn(tileEngine, "splitUpImageData");
      spyOn(tileEngine.canvas, "getContext").andCallThrough();
      spyOn(tileEngine, "resetCanvas");
      loadImageCb(null);
      expect(myCbCalled).toBeTruthy();
      expect(tileEngine.canvas.width).toBe(tileEngine.spritesImage.width);
      expect(tileEngine.canvas.height).toBe(tileEngine.spritesImage.height);
      expect(tileEngine.canvas.getContext).toHaveBeenCalledWith("2d");
      expect(tileEngine.ctx.drawImage).toHaveBeenCalledWith(tileEngine.spritesImage, 0, 0);
      expect(tileEngine.splitUpImageData).toHaveBeenCalled();
      return expect(tileEngine.resetCanvas).toHaveBeenCalled();
    });
    it("should reset the canvas", function() {
      spyOn(tileEngine.canvas, "getContext").andReturn("fake context");
      tileEngine.resetCanvas();
      expect(tileEngine.canvas.getContext).toHaveBeenCalledWith("2d");
      expect(tileEngine.ctx).toBe("fake context");
      expect(tileEngine.canvas.width).toBe(tileEngine.displayWidthInTiles * tileEngine.tileWidth);
      return expect(tileEngine.canvas.height).toBe(tileEngine.displayHeightInTiles * tileEngine.tileWidth);
    });
    it("should know how to split up the image data", function() {
      var h, w;
      tileEngine.spritesImage = {};
      tileEngine.spritesImage.width = 32;
      tileEngine.spritesImage.height = 32;
      spyOn(tileEngine.ctx, "getImageData");
      tileEngine.splitUpImageData();
      for (w = 0; w < 2; w++) {
        for (h = 0; h < 2; h++) {
          expect(tileEngine.ctx.getImageData).toHaveBeenCalledWith(w * 16, h * 16, 16, 16);
        }
      }
      return expect(tileEngine.sprites.length).toBe(4);
    });
    it("should be able to draw a map", function() {
      tileEngine.defineAsciiTiles(".rp\nvxw");
      expect(tileEngine.asciiDefinitions["."]).toBe(0);
      expect(tileEngine.asciiDefinitions.r).toBe(1);
      expect(tileEngine.asciiDefinitions.w).toBe(5);
      spyOn(tileEngine, "drawTiles");
      tileEngine.drawAsciiMap(".r.................p\nr");
      return expect(tileEngine.drawTiles).toHaveBeenCalledWith(0, [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 1]);
    });
    it("should know how to draw tiles", function() {
      spyOn(tileEngine, "drawTile");
      tileEngine.drawTiles(0, [0, 2]);
      expect(tileEngine.drawTile).toHaveBeenCalledWith(0, 0);
      return expect(tileEngine.drawTile).toHaveBeenCalledWith(1, 2);
    });
    return it("should know how to draw a tile", function() {
      tileEngine.sprites = ["pretendImagedata0", "pretendImageData1"];
      spyOn(tileEngine.ctx, "putImageData");
      false && tileEngine.drawTile(3, 0);
      false && expect(tileEngine.ctx.putImageData).toHaveBeenCalledWith(tileEngine.sprites[0], 3 * 16, 0);
      tileEngine.drawTile(21, 0);
      return expect(tileEngine.ctx.putImageData).toHaveBeenCalledWith(tileEngine.sprites[0], 1 * 16, 1 * 16);
    });
  });
}).call(this);
