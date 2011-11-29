describe "TileEngine", ->
  TileEngine = dModule.require "tile-engine"
  tileEngine = null
  beforeEach ->
    tileEngine = new TileEngine()

  it "should have a canvas element", ->
    expect(tileEngine.canvas.constructor).toBe(HTMLCanvasElement)
    expect(tileEngine.ctx.constructor).toBe CanvasRenderingContext2D

  it "should load in an image of all the sprites", ->
    spyOn(window, "Image").andReturn({
      width: 160  
      height: 160  
    })
    
    myCbCalled = false
    myCb = -> myCbCalled = true
    loadImageCb = tileEngine.loadImage("sprites.png", myCb)
    expect(window.Image).toHaveBeenCalled()
    expect(tileEngine.spritesImage.src).toBe("sprites.png")
    expect(tileEngine.spritesImage.onload).toBe(loadImageCb)

    spyOn tileEngine.ctx, "drawImage"

    spyOn(tileEngine, "splitUpImageData")
    spyOn(tileEngine.canvas, "getContext").andCallThrough()
    spyOn(tileEngine, "resetCanvas")

    loadImageCb(null) 
    expect(myCbCalled).toBeTruthy()

    expect(tileEngine.canvas.width).toBe(tileEngine.spritesImage.width)
    expect(tileEngine.canvas.height).toBe(tileEngine.spritesImage.height)
    expect(tileEngine.canvas.getContext).toHaveBeenCalledWith("2d")

    expect(tileEngine.ctx.drawImage).toHaveBeenCalledWith(
      tileEngine.spritesImage,
      0, 0
    )
    expect(tileEngine.splitUpImageData).toHaveBeenCalled()
    expect(tileEngine.resetCanvas).toHaveBeenCalled()

  it "should reset the canvas", ->
    spyOn(tileEngine.canvas, "getContext").andReturn "fake context"
    tileEngine.resetCanvas()
    expect(tileEngine.canvas.getContext).toHaveBeenCalledWith("2d")
    expect(tileEngine.ctx).toBe "fake context"
    expect(tileEngine.canvas.width).toBe(tileEngine.displayWidthInTiles * tileEngine.tileWidth)
    expect(tileEngine.canvas.height).toBe(tileEngine.displayHeightInTiles * tileEngine.tileWidth)
  

  it "should know how to split up the image data", ->
    tileEngine.spritesImage = {}
    tileEngine.spritesImage.width = 32
    tileEngine.spritesImage.height = 32
    spyOn(tileEngine.ctx, "getImageData")
    tileEngine.splitUpImageData()
    for w in [0...2]
      for h in [0...2]
        expect(tileEngine.ctx.getImageData).toHaveBeenCalledWith(
          w * 16, h * 16, 16, 16
        )
    expect(tileEngine.sprites.length).toBe(4)


  it "should be able to draw a map", ->
    tileEngine.defineAsciiTiles """
      .rp
      vxw
    """
    expect(tileEngine.asciiDefinitions["."]).toBe(0)
    expect(tileEngine.asciiDefinitions.r).toBe(1)
    expect(tileEngine.asciiDefinitions.w).toBe(5)

    spyOn(tileEngine, "drawTiles")
    tileEngine.drawAsciiMap """
      .r.................p
      r
    """
    expect(tileEngine.drawTiles).toHaveBeenCalledWith(
      0, [0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,1]  
    )

  it "should know how to draw tiles", ->
    spyOn tileEngine, "drawTile"
    tileEngine.drawTiles(0, [0,2])
    expect(tileEngine.drawTile).toHaveBeenCalledWith(0,0)
    expect(tileEngine.drawTile).toHaveBeenCalledWith(1,2)
 
  it "should know how to draw a tile", ->
    tileEngine.sprites = ["pretendImagedata0", "pretendImageData1"]
    spyOn tileEngine.ctx, "putImageData"
    false and tileEngine.drawTile(3, 0)
    false and expect(tileEngine.ctx.putImageData).toHaveBeenCalledWith(
      tileEngine.sprites[0], 3 * 16, 0
    )
    tileEngine.drawTile(21, 0)
    expect(tileEngine.ctx.putImageData).toHaveBeenCalledWith(
      tileEngine.sprites[0], 1 * 16, 1 * 16
    )
