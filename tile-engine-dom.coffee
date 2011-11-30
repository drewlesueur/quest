dModule.define "tile-engine-dom", ->
  class TileEngine
    constructor: ->
      @sprites = []
      @canvas = document.createElement "div"
      @tileWidth = 16
      @displayWidthInTiles = 20
      @displayHeightInTiles = 20
      @spritesImageWidth = 160
      @canvas.style.width = @displayWidthInTiles * @tileWidth + "px"
      @canvas.style.height = @displayHeightInTiles * @tileWidth + "px"
      @canvas.style.position = "relative"
      @tiles = []

    loadImage: (src, cb = ->) =>
      @spritesImage = {src: src}
      @spritesImage.src = src
      onload = () =>
        @setTiles()
        @do
        cb(null)
      onload()

      return onload
      
    setTiles: () =>
      @tiles = []
      numberOfTiles = @displayWidthInTiles * @displayHeightInTiles
      for i in [0...numberOfTiles]
        @addTile()
      
    addTile: () =>
      tile = @makeDiv()
      tile.style.left = (@tiles.length % @displayWidthInTiles) * @tileWidth + "px"
      tile.style.top = Math.floor(@tiles.length / @displayWidthInTiles) * @tileWidth + "px"
      tile.style.width = @tileWidth + "px"
      tile.style.height = @tileWidth + "px"
      tile.style.backgroundImage = "url(#{@spritesImage.src})"
      tile.style.position = "absolute"
      tile.style.overflow = "hidden"
      @tiles.push tile
      @canvas.appendChild tile

      
    makeDiv: () =>
      document.createElement "div"


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
      x = (tileIndex % @spritesImageWidth) * @tileWidth
      y = (Math.floor(tileIndex / @spritesImageWidth)) * @tileWidth
      @tiles[index].style.backgroundPosition = "-#{x}px -#{y}px"
      #@ctx.putImageData(@sprites[tileIndex], x, y)




       

    
