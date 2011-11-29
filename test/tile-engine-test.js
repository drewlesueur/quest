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
      spyOn(window, "Image").andReturn({
        width: 160,
        height: 160
      });
      tileEngine.loadImage("sprites.png");
      expect(window.Image).toHaveBeenCalled();
      expect(tileEngine.spritesImage.src).toBe("sprites.png");
      expect(tileEngine.spritesImage.onload).toBe(tileEngine.splitUpSprites);
      spyOn(tileEngine.ctx, "drawImage");
      spyOn(tileEngine, "splitUpImageData");
      spyOn(tileEngine.canvas, "getContext").andCallThrough();
      tileEngine.splitUpSprites();
      expect(tileEngine.canvas.width).toBe(tileEngine.spritesImage.width);
      expect(tileEngine.canvas.height).toBe(tileEngine.spritesImage.height);
      expect(tileEngine.canvas.getContext).toHaveBeenCalledWith("2d");
      expect(tileEngine.ctx.drawImage).toHaveBeenCalledWith(tileEngine.spritesImage, 0, 0);
      return expect(tileEngine.splitUpImageData).toHaveBeenCalled();
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
    return it("should be able to draw a map", function() {
      tileEngine.defineAsciiTiles(".rp\nvxw");
      expect(tileEngine.asciiDefinitions["."]).toBe(0);
      expect(tileEngine.asciiDefinitions.r).toBe(1);
      expect(tileEngine.asciiDefinitions.w).toBe(5);
      return tileEngine.drawAsciiMap("....................\n...rrrrr............\n..r.................\n...r.rrr............\n....................\n....................\n...........rrrrr....\n...............r....\n............rrrr....\n....................\n....................\n....................\n..........rrr.......\n.........r..........\n........r...........\n......r.............\n.....r..............\n....................\n....................\n....................");
    });
  });
}).call(this);
