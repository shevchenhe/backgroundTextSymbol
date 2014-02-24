define("bgText/bgTextGraphicLayer",[
	"esri/geometry/screenUtils",
	"esri/graphic",
	"esri/layers/GraphicsLayer",
	"dojo/_base/declare"
], function(
	screenUtils,
	Graphic,
	GraphicsLayer, declare
) {
	var returnClass = declare(GraphicsLayer, {
		declaredClass:"bgText.bgTextGraphicLayer",
		_draw: function(graphic, redraw) { //_5f是绘制的graphic,_60表示是否redraw重绘
			if (!this._params.drawMode || !this._map || this.suspended) {
				return;
			}
			try {
				var extent = graphic._extent,
					offset, bgFillsymbol, textSymbol; //拉框放大的时候也会绘制geometry，这个时候_5f.geometry._originOnly的值才是true，其余的情况下都是false
				if ((bgFillsymbol = graphic.getBgFillSymbol()) && (textSymbol=graphic.getTextSymbol()) && graphic.visible && extent && (offset = this._intersects(this._map, extent, graphic.geometry._originOnly))) {
					if (!graphic.getBgShape() || !graphic.getTextShape() || redraw || offset) {
						var type = graphic.geometry.type;
						if (type === "point") {
							this._drawMarker(graphic, bgFillsymbol, offset, "bg");
							this._drawMarker(graphic, textSymbol, offset, "text"); //(graphic._extent,symbol,offset)
							//this._symbolizeMarker(graphic, _63);暂时不好处理
						}
					}
				} else {
					if (graphic.getBgShape()) {
						this._removeShape(graphic);
					}
				}
			} catch (err) {
				this._errorHandler(err, graphic);
			}
		},
		_removeShape:function  (graphic) {
			var bgShape=graphic.getBgShape();
			var textShape=graphic.getTextShape();
			bgShape.removeShape();textShape.removeShape();
			graphic._bgShape=null;graphic._textShape=null;
		},
		_drawMarker: function(graphic, symbol, offset, flag) {
			if (flag === "text") {
				graphic._textShape = this._drawPoint(this._div, graphic.geometry, symbol,graphic.getTextShape() , offset);
				this._symbolizeMarker(graphic,symbol);
			} else if (flag == "bg") {
				this._drawShape(graphic, offset);
				this._symbolizeShape(graphic, symbol);
			}
		},
		_symbolizeMarker: function(graphic,symbol) {
			this._symbolizePoint(graphic.getTextShape(),symbol);
		},
		_symbolizeShape: function(graphic, symbol) {
			var stroke = symbol._stroke,
				fill = symbol._fill;

			if (stroke === null || fill === null) {
				stroke = symbol.getStroke();
				fill = symbol.getFill();
			}

			graphic.getBgShape().setStroke(stroke).setFill(fill);
			symbol._stroke = stroke;
			symbol._fill = fill;
		},
		_drawShape: function(graphic, offsets) {//parseInt(font.size)
			var fontsize=parseInt(graphic._fontSize);
			var geometry = graphic.geometry,
				rectw = fontsize * graphic._textLength/2,
				recth = graphic.defaultPadding * 2 + fontsize,
				//type=geometry.type,
				map = this._map,
				me = map.extent,
				mw = map.width,
				mh = map.height,
				_mvr = map.__visibleRect;
			var xy = screenUtils.toScreenPoint(me, mw, mh, geometry);
			var rect = {
				x: xy.x - _mvr.x + offsets[0] - graphic.defaultOffset,
				y: xy.y - _mvr.y + graphic.defaultOffset-recth,
				width: rectw,
				height: recth
			};
			graphic._bgShape = this._drawRect(this._div, graphic.getBgShape(), rect);
		}
	})
	return returnClass;
});