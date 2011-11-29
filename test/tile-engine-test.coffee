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

    tileEngine.loadImage("sprites.png")
    expect(window.Image).toHaveBeenCalled()
    expect(tileEngine.spritesImage.src).toBe("sprites.png")
    expect(tileEngine.spritesImage.onload).toBe(tileEngine.splitUpSprites)

    spyOn tileEngine.ctx, "drawImage"

    spyOn(tileEngine, "splitUpImageData")
    spyOn(tileEngine.canvas, "getContext").andCallThrough()

    tileEngine.splitUpSprites() 
    expect(tileEngine.canvas.width).toBe(tileEngine.spritesImage.width)
    expect(tileEngine.canvas.height).toBe(tileEngine.spritesImage.height)
    expect(tileEngine.canvas.getContext).toHaveBeenCalledWith("2d")

    expect(tileEngine.ctx.drawImage).toHaveBeenCalledWith(
      tileEngine.spritesImage,
      0, 0
    )
    expect(tileEngine.splitUpImageData).toHaveBeenCalled()

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
    tileEngine.drawAsciiMap """
      ....................
      ...rrrrr............
      ..r.................
      ...r.rrr............
      ....................
      ....................
      ...........rrrrr....
      ...............r....
      ............rrrr....
      ....................
      ....................
      ....................
      ..........rrr.......
      .........r..........
      ........r...........
      ......r.............
      .....r..............
      ....................
      ....................
      ....................
    """

