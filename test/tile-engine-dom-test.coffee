describe "TileEngineDom", ->
  TileEngine = dModule.require "tile-engine-dom"
  tileEngine = null
  beforeEach ->
    tileEngine = new TileEngine()
    spyOn(tileEngine.canvas, "appendChild")

  it "should have a canvas element", ->
    expect(tileEngine.canvas.constructor).toBe(HTMLDivElement)

  it "should load in an image of all the sprites", ->
    fakeImage =
      width: 160  
      height: 160  

    myCbCalled = false
    myCb = -> myCbCalled = true
    spyOn(tileEngine, "setTiles")

    #TODO: this is hardcoded for now
    expect(tileEngine.spritesImageWidth).toBe(160)

    loadImageCb = tileEngine.loadImage("sprites.png", myCb)
    expect(tileEngine.spritesImage.src).toBe("sprites.png")
    expect(tileEngine.canvas.style.width).toBe(tileEngine.displayWidthInTiles * tileEngine.tileWidth + "px")
    expect(tileEngine.canvas.style.height).toBe(tileEngine.displayHeightInTiles * tileEngine.tileWidth + "px")
    expect(tileEngine.canvas.style.position).toBe("relative")
    #loadImageCb() #called automatically, no need to wait for load
    expect(tileEngine.setTiles).toHaveBeenCalled()

    expect(myCbCalled).toBe true

  it "should know how to set the tiles", ->
    spyOn(tileEngine, "makeDiv").andReturn
      style: {}
    spyOn tileEngine, "addTile"
    tileEngine.setTiles()
    numberOfTiles = tileEngine.displayWidthInTiles * tileEngine.displayHeightInTiles
    for i in [0...numberOfTiles] 
      expect(tileEngine.addTile).toHaveBeenCalled()
    

  it "should know how to add a div tile to the canvas", ->
    tileEngine.spritesImage = {src : "http://test.com/"}
    tileEngine.addTile()
    expect(tileEngine.tiles.length).toBe(1)
    expect(tileEngine.tiles[0].constructor).toBe(HTMLDivElement)
    expect(tileEngine.tiles[0].style.left).toBe("0px")
    expect(tileEngine.tiles[0].style.top).toBe("0px")
    expect(tileEngine.tiles[0].style.position).toBe("absolute")
    expect(tileEngine.tiles[0].style.width).toBe(tileEngine.tileWidth + "px")
    expect(tileEngine.tiles[0].style.height).toBe(tileEngine.tileWidth + "px")
    expect(tileEngine.tiles[0].style.backgroundImage).toBe("url(http://test.com/)")
    expect(tileEngine.tiles[0].style.overflow).toBe("hidden")
    expect(tileEngine.canvas.appendChild).toHaveBeenCalledWith(tileEngine.tiles[0])
    tileEngine.addTile()
    expect(tileEngine.tiles.length).toBe(2)
    expect(tileEngine.tiles[1].constructor).toBe(HTMLDivElement)
    expect(tileEngine.tiles[1].style.left).toBe(tileEngine.tileWidth * 1 + "px")
    expect(tileEngine.tiles[1].style.top).toBe("0px")
    expect(tileEngine.tiles[1].style.position).toBe("absolute")
    expect(tileEngine.canvas.appendChild).toHaveBeenCalledWith(tileEngine.tiles[1])
    #TODO: go past the y 


  it "should know how to make a div", ->
    spyOn(document, "createElement").andReturn("div!")
    tileEngine.makeDiv()
    expect(document.createElement).toHaveBeenCalledWith("div")


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
    spyOn(tileEngine, "makeDiv").andReturn
      style: {}
    tileEngine.spritesImage = {src : "http://test.com/"}

    tileEngine.setTiles() 

    tileEngine.drawTile(3, 0)
    expect(tileEngine.tiles[3].style.backgroundPosition).toBe(
      "-#{3 * 16}px -#{0}px"
    )
    tileEngine.drawTile(21, 0)
    expect(tileEngine.tiles[21].style.backgroundPosition).toBe(
      "-#{16}px -#{16}px"
    )
