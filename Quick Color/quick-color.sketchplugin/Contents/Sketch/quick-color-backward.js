//this loops the plugin backwards

function onRun(context) {

  document = context.document;
  selection = context.selection;

  // checks if the array color is already in the array
  function containsObject(obj, list) {
    var i;
    for (i = 0; i < list.length; i++) {
        if (list[i] === obj) {
            return true;
        }
    }
    return false;
  }

  // Get document colors array
  var documentColors = document.documentData().assets().colors();

 // Checks if there are document colors
  if (documentColors.count() > 0) {

    // Convert MSColors into hex strings
    var palette = [];

    for (var i = 0; i < documentColors.count(); i++) {
      palette.push("#" + documentColors[i].hexValue());

      //checks to see if colors have a alpha < 1 as not supported yet
      if (documentColors[i].alpha() < 1) {
        document.showMessage("The plugin currently does not support colors with opacity less than 100%, please remove from Document Colors")
      }
    }
  } else {
    document.showMessage("You don't have any Document Colors Palette set yet")
  }

  // Prepare for looping through objects in current selection
  var loop = selection.objectEnumerator()

  while (item = loop.nextObject()) {

    //Is the the sleected item a shape
    if (item.class() === MSShapeGroup) {

      //Get layer style
      var shapeStyle = item.style();

      //Get layer style fills array
      var fills = shapeStyle.fills();

      // Set fill style if not created
      if(fills.count() <= 0){
        fills.addNewStylePart();
      }

      //Get first fill layer style
      var fill = fills.firstObject();

      // Get the current hex color of the first fill layer style
      var currentFill ="#"+fill.color().hexValue()

      current = palette.indexOf(currentFill)
      if (containsObject(currentFill, palette) == true && current > 0) {
        //Go to the previous color in the palette
        [fill setColor:[MSColor colorWithSVGString: palette[current - 1]]];
      } else if (current == 0) {
        [fill setColor:[MSColor colorWithSVGString: palette[documentColors.count()-1]]];
      } else {
        //Go to the first color in the palette
        [fill setColor:[MSColor colorWithSVGString: palette[0]]];
      }
    }
  }
}
