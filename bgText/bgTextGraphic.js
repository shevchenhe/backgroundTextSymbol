define("bgText/bgTextGraphic",[
  "esri/graphic",
  "dojo/_base/declare"
], function(
  Graphic,
  declare
) {
	var returnClass=declare(Graphic,{
	declaredClass:"bgText.bgTextGraphic",
	_bgTextGraphicLayer:null,
	_textLength:null,
	_fontSize:null,
	_textShape:null,
	_bgShape:null,
	bgFillSymbol:null,
	textSymbol:null,
	defaultOffset:5,//默认的偏移量5px
	defaultPadding:4,//默认的padding值4px
	constructor:function (geometry,textSymbol,simpleFillsymbol) {
		this.geometry=geometry;
		this.textSymbol=textSymbol;
		this.bgFillSymbol=simpleFillsymbol;
		this._textLength=textSymbol.text.length;
		this._fontSize=textSymbol.font.size;
	},
	setTextSymbol:function  (textSymbol) {
		this.textSymbol=textSymbol;
	},
	getTextSymbol:function  () {
		return this.textSymbol;
	},
	setBgFillSymbol:function  (simpleFillsymbol) {
		this.bgFillSymbol=simpleFillsymbol;
	},
	getBgFillSymbol:function  () {
		return this.bgFillSymbol;
	},
	getbgTextGraphicLayer:function  () {
		return this._bgTextGraphicLayer;
	},
	setGeometry:function  (geometry) {
		this.geometry=geometry;
		var bgTextGraphicLayer=this._bgTextGraphicLayer;
		if(bgTextGraphicLayer){
			bgTextGraphicLayer._updateExtent(this);
			bgTextGraphicLayer._draw(this,true);
		}
		return this;
	},
	getTextShape:function  () {
		return this._textShape;
	},
	getBgShape:function  () {
		return this._bgShape;
	}
	})
	return returnClass;

});