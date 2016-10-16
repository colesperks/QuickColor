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

  // Convert MSColors into hex strings
  var palette = [];
    for (var i = 0; i < documentColors.count(); i++) {
      palette.push("#" + documentColors[i].hexValue());


      if (documentColors[i].alpha() < 1) {
        alert("no")
      }
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
      if (containsObject(currentFill, palette) == true && current < documentColors.count()-1) {
        //Go to the next color in the palette
        [fill setColor:[MSColor colorWithSVGString: palette[current + 1]]];
      } else {
        //Go to the first color in the palette
        [fill setColor:[MSColor colorWithSVGString: palette[0]]];
      }
    }
  }
}
