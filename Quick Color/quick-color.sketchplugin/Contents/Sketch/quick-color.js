
var fillColorFromGlobalColorsForward = function(context) {
    fillColorFormColors(
        context,
        NSApp.delegate().globalAssets().colors(),
        true,
        "You don't have any Global Colors Palette set yet"
    );
}

var fillColorFromGlobalColorsBackward = function(context) {
    fillColorFormColors(
        context,
        NSApp.delegate().globalAssets().colors(),
        false,
        "You don't have any Global Colors Palette set yet"
    );
}

var fillColorFromDocumentColorsForward = function(context) {
    fillColorFormColors(
        context,
        context.document.documentData().assets().colors(),
        true,
        "You don't have any Document Colors Palette set yet"
    );
}

var fillColorFromDocumentColorsBackward = function(context) {
    fillColorFormColors(
        context,
        context.document.documentData().assets().colors(),
        false,
        "You don't have any Document Colors Palette set yet"
    );
}

function fillColorFormColors(context, colors, forward, alertMessage) {
    var doc = context.document;

    if (colors.count() == 0) {
        doc.showMessage(alertMessage);
        return false;
    }

    var selection = context.selection;

    if (selection.count() == 0) {
        doc.showMessage("Please select one Shape or Text layer.");
        return false;
    }

    for (var i = 0; i < selection.count(); i++) {
        var layer = selection.objectAtIndex(i);
        if (layer.class() == "MSShapeGroup" || layer.class() == "MSTextLayer") {
            var index = colors.indexOfObject(getFillColor(layer));

            if (forward) {
                if (index == 9.223372036854776e+18 || index == colors.count() - 1) {
                    index = 0;
                } else {
                    index ++;
                }
            } else {
                if (index == 9.223372036854776e+18 || index == 0) {
                    index = colors.count() - 1;
                } else {
                    index --;
                }
            }

            setFillColor(layer, colors.objectAtIndex(index));
        }
    }

}

function getFillColor(layer) {
    if (layer.class() == "MSShapeGroup") {
        var fills = layer.style().enabledFills();
        if (fills.count() > 0) {
            if (fills.lastObject().fillType() == 0) {
                return fills.lastObject().color();
            } else {
                return null;
            }
        } else {
            return null;
        }
    }
    if (layer.class() == "MSTextLayer") {
        return layer.textColor();
    }
}

function setFillColor(layer, color) {
    if (layer.class() == "MSShapeGroup") {
        var fills = layer.style().enabledFills();
        if (fills.count() > 0 && fills.lastObject().fillType() == 0) {
            fills.lastObject().setColor(color);
        } else {
            var fill = layer.style().addStylePartOfType(0);
            fill.setFillType(0);
            fills.lastObject().setColor(color);
        }
    }
    if (layer.class() == "MSTextLayer") {
        layer.setTextColor(color);
    }
}
