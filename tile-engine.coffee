dModule.define "tile-engine", ->
  class TileEngine
    constructor: ->
      @sprites = []
      @canvas = document.createElement "canvas"
      @ctx = @canvas.getContext("2d")

    loadImage: (src) =>
      @spritesImage = new Image()
      @spritesImage.src = src
      @spritesImage.onload = @splitUpSprites
      

    imageLoaded: =>

    splitUpSprites: () =>  
      @canvas.width =  @spritesImage.width
      @canvas.height = @spritesImage.height
      @ctx = @canvas.getContext('2d')
      @ctx.drawImage @spritesImage, 0, 0
      @splitUpImageData()

    splitUpImageData: () =>
      i = 0
      @sprites = []
      tileWidth = 16
      spritesImageTileWidth = @spritesImage.width / tileWidth
      spritesImageTileHeight = @spritesImage.height / tileWidth
      console.log spritesImageTileWidth, spritesImageTileHeight
      for w in [0...spritesImageTileWidth]
        for h in [0...spritesImageTileHeight]
          @sprites[i] = @ctx.getImageData w * 16, h * 16, 16, 16
          i += 1

    defineAsciiTiles: (text) =>
      @asciiDefinitions = {}
      #TODO: ie?
      text = text.replace /[\n\r]/g, ""
      for i in [0...text.length]
        chr = text[i] 
        @asciiDefinitions[chr] = i



       

    
