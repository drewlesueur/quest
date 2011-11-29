dModule.define "tile-engine", ->
  class TileEngine
    constructor: ->
      @sprites = []
      @canvas = document.createElement "canvas"
      @ctx = @canvas.getContext("2d")
      @tileWidth = 16
      @displayWidthInTiles = 20
      @displayHeightInTiles = 20

    loadImage: (src, cb) =>
      @spritesImage = new Image()
      @spritesImage.src = src
      @spritesImage.onload = () =>
        @splitUpSprites()
        #do I need to do this
        @resetCanvas()
        cb?(null)
      

    resetCanvas: () =>
      @canvas.width = @displayWidthInTiles * @tileWidth
      @canvas.height = @displayHeightInTiles * @tileWidth
      @ctx = @canvas.getContext "2d"
      

    splitUpSprites: () =>  
      @canvas.width =  @spritesImage.width
      @canvas.height = @spritesImage.height
      @ctx = @canvas.getContext('2d')
      @ctx.drawImage @spritesImage, 0, 0
      @splitUpImageData()

    splitUpImageData: () =>
      i = 0
      @sprites = []
      spritesImageTileWidth = @spritesImage.width / @tileWidth
      spritesImageTileHeight = @spritesImage.height / @tileWidth
      #TODO: widht height order is not tested
      for h in [0...spritesImageTileHeight]
        for w in [0...spritesImageTileWidth]
          @sprites[i] = @ctx.getImageData w * 16, h * 16, 16, 16
          i += 1

    defineAsciiTiles: (text) =>
      @asciiDefinitions = {}
      #TODO: ie?
      text = text.replace /[\n\r]/g, ""
      for i in [0...text.length]
        chr = text[i] 
        @asciiDefinitions[chr] = i

    drawAsciiMap: (str) =>
      tiles = []
      str = str.replace(/[\n\r]/g, "" )
      for i in [0...str.length]
        chr = str[i]
        tiles.push @asciiDefinitions[chr] 
      @drawTiles 0, tiles


    drawTiles: (index, tiles) =>
      for i in [0...tiles.length]
        tile =  tiles[i]
        @drawTile index + i, tile 

    drawTile: (index, tileIndex) =>
      x = (index % @displayWidthInTiles) * @tileWidth
      y = (Math.floor(index / @displayWidthInTiles)) * @tileWidth

      @ctx.putImageData(@sprites[tileIndex], x, y)




       

    
