"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentParser = exports.autos = void 0;
var dom_1 = require("./dom/dom");
var utils = require("./utils");
var common_1 = require("./dom/common");
var common_2 = require("./parser/common");
var paragraph_1 = require("./parser/paragraph");
var section_1 = require("./parser/section");
var break_1 = require("./elements/break");
var hyperlink_1 = require("./elements/hyperlink");
var run_1 = require("./elements/run");
var cell_1 = require("./elements/cell");
var table_1 = require("./elements/table");
var row_1 = require("./elements/row");
var paragraph_2 = require("./elements/paragraph");
var image_1 = require("./elements/image");
var drawing_1 = require("./elements/drawing");
var xml_serialize_1 = require("./parser/xml-serialize");
exports.autos = {
    shd: "white",
    color: "black",
    highlight: "transparent"
};
var DocumentParser = (function () {
    function DocumentParser() {
        this.skipDeclaration = true;
        this.ignoreWidth = false;
        this.debug = false;
    }
    DocumentParser.prototype.parseDocumentRelationsFile = function (xmlString) {
        var xrels = xml.parse(xmlString, this.skipDeclaration);
        return xml.elements(xrels).map(function (c) { return ({
            id: xml.stringAttr(c, "Id"),
            type: values.valueOfRelType(c),
            target: xml.stringAttr(c, "Target"),
        }); });
    };
    DocumentParser.prototype.parseFontTable = function (xmlString) {
        var xfonts = xml.parse(xmlString, this.skipDeclaration);
        return xml.elements(xfonts).map(function (c) { return ({
            name: xml.stringAttr(c, "name"),
            fontKey: xml.elementStringAttr(c, "embedRegular", "fontKey"),
            refId: xml.elementStringAttr(c, "embedRegular", "id")
        }); });
    };
    DocumentParser.prototype.parseDocumentFile = function (xmlString) {
        var _this = this;
        var result = {
            type: dom_1.DomType.Document,
            children: [],
            style: {},
            props: null
        };
        var xbody = xml.byTagName(xml.parse(xmlString, this.skipDeclaration), "body");
        xml.foreach(xbody, function (elem) {
            switch (elem.localName) {
                case "p":
                    result.children.push(_this.parseParagraph(elem));
                    break;
                case "tbl":
                    result.children.push(_this.parseTable(elem));
                    break;
                case "sectPr":
                    result.props = section_1.parseSectionProperties(elem);
                    break;
            }
        });
        return result;
    };
    DocumentParser.prototype.parseStylesFile = function (xmlString) {
        var _this = this;
        var result = [];
        var xstyles = xml.parse(xmlString, this.skipDeclaration);
        xml.foreach(xstyles, function (n) {
            switch (n.localName) {
                case "style":
                    result.push(_this.parseStyle(n));
                    break;
                case "docDefaults":
                    result.push(_this.parseDefaultStyles(n));
                    break;
            }
        });
        return result;
    };
    DocumentParser.prototype.parseDefaultStyles = function (node) {
        var _this = this;
        var result = {
            id: null,
            name: null,
            target: null,
            basedOn: null,
            styles: []
        };
        xml.foreach(node, function (c) {
            switch (c.localName) {
                case "rPrDefault":
                    var rPr = xml.byTagName(c, "rPr");
                    if (rPr)
                        result.styles.push({
                            target: "span",
                            values: _this.parseDefaultProperties(rPr, {})
                        });
                    break;
                case "pPrDefault":
                    var pPr = xml.byTagName(c, "pPr");
                    if (pPr)
                        result.styles.push({
                            target: "p",
                            values: _this.parseDefaultProperties(pPr, {})
                        });
                    break;
            }
        });
        return result;
    };
    DocumentParser.prototype.parseCommonProperties = function (elem, props) {
        if (elem.namespaceURI != common_1.ns.wordml)
            return;
        switch (elem.localName) {
            case "color":
                props.color = common_2.colorAttr(elem, elem.namespaceURI, "val");
                break;
            case "sz":
                props.fontSize = common_2.lengthAttr(elem, elem.namespaceURI, "val", common_2.LengthUsage.FontSize);
                break;
        }
    };
    DocumentParser.prototype.parseStyle = function (node) {
        var _this = this;
        var result = {
            id: xml.className(node, "styleId"),
            isDefault: xml.boolAttr(node, "default"),
            name: null,
            target: null,
            basedOn: null,
            styles: [],
            linked: null
        };
        switch (xml.stringAttr(node, "type")) {
            case "paragraph":
                result.target = "p";
                break;
            case "table":
                result.target = "table";
                break;
            case "character":
                result.target = "span";
                break;
        }
        xml.foreach(node, function (n) {
            switch (n.localName) {
                case "basedOn":
                    result.basedOn = xml.className(n, "val");
                    break;
                case "name":
                    result.name = xml.stringAttr(n, "val");
                    break;
                case "link":
                    result.linked = xml.className(n, "val");
                    break;
                case "aliases":
                    result.aliases = xml.stringAttr(n, "val").split(",");
                    break;
                case "pPr":
                    result.styles.push({
                        target: "p",
                        values: _this.parseDefaultProperties(n, {})
                    });
                    break;
                case "rPr":
                    result.styles.push({
                        target: "span",
                        values: _this.parseDefaultProperties(n, {})
                    });
                    break;
                case "tblPr":
                case "tcPr":
                    result.styles.push({
                        target: "td",
                        values: _this.parseDefaultProperties(n, {})
                    });
                    break;
                case "tblStylePr":
                    for (var _i = 0, _a = _this.parseTableStyle(n); _i < _a.length; _i++) {
                        var s = _a[_i];
                        result.styles.push(s);
                    }
                    break;
                case "rsid":
                case "qFormat":
                case "hidden":
                case "semiHidden":
                case "unhideWhenUsed":
                case "autoRedefine":
                case "uiPriority":
                    break;
                default:
                    _this.debug && console.warn("DOCX: Unknown style element: " + n.localName);
            }
        });
        return result;
    };
    DocumentParser.prototype.parseTableStyle = function (node) {
        var _this = this;
        var result = [];
        var type = xml.stringAttr(node, "type");
        var selector = "";
        switch (type) {
            case "firstRow":
                selector = "tr.first-row td";
                break;
            case "lastRow":
                selector = "tr.last-row td";
                break;
            case "firstCol":
                selector = "td.first-col";
                break;
            case "lastCol":
                selector = "td.last-col";
                break;
            case "band1Vert":
                selector = "td.odd-col";
                break;
            case "band2Vert":
                selector = "td.even-col";
                break;
            case "band1Horz":
                selector = "tr.odd-row";
                break;
            case "band2Horz":
                selector = "tr.even-row";
                break;
            default: return [];
        }
        xml.foreach(node, function (n) {
            switch (n.localName) {
                case "pPr":
                    result.push({
                        target: selector + " p",
                        values: _this.parseDefaultProperties(n, {})
                    });
                    break;
                case "rPr":
                    result.push({
                        target: selector + " span",
                        values: _this.parseDefaultProperties(n, {})
                    });
                    break;
                case "tblPr":
                case "tcPr":
                    result.push({
                        target: selector,
                        values: _this.parseDefaultProperties(n, {})
                    });
                    break;
            }
        });
        return result;
    };
    DocumentParser.prototype.parseNumberingFile = function (xmlString) {
        var _this = this;
        var result = [];
        var xnums = xml.parse(xmlString, this.skipDeclaration);
        var mapping = {};
        var bullets = [];
        xml.foreach(xnums, function (n) {
            switch (n.localName) {
                case "abstractNum":
                    _this.parseAbstractNumbering(n, bullets)
                        .forEach(function (x) { return result.push(x); });
                    break;
                case "numPicBullet":
                    bullets.push(_this.parseNumberingPicBullet(n));
                    break;
                case "num":
                    var numId = xml.stringAttr(n, "numId");
                    var abstractNumId = xml.elementStringAttr(n, "abstractNumId", "val");
                    mapping[abstractNumId] = numId;
                    break;
            }
        });
        result.forEach(function (x) { return x.id = mapping[x.id]; });
        return result;
    };
    DocumentParser.prototype.parseNumberingPicBullet = function (elem) {
        var pict = xml.byTagName(elem, "pict");
        var shape = pict && xml.byTagName(pict, "shape");
        var imagedata = shape && xml.byTagName(shape, "imagedata");
        return imagedata ? {
            id: xml.intAttr(elem, "numPicBulletId"),
            src: xml.stringAttr(imagedata, "id"),
            style: xml.stringAttr(shape, "style")
        } : null;
    };
    DocumentParser.prototype.parseAbstractNumbering = function (node, bullets) {
        var _this = this;
        var result = [];
        var id = xml.stringAttr(node, "abstractNumId");
        xml.foreach(node, function (n) {
            switch (n.localName) {
                case "lvl":
                    result.push(_this.parseNumberingLevel(id, n, bullets));
                    break;
            }
        });
        return result;
    };
    DocumentParser.prototype.parseNumberingLevel = function (id, node, bullets) {
        var _this = this;
        var result = {
            id: id,
            level: xml.intAttr(node, "ilvl"),
            style: {}
        };
        xml.foreach(node, function (n) {
            switch (n.localName) {
                case "pPr":
                    _this.parseDefaultProperties(n, result.style);
                    break;
                case "lvlPicBulletId":
                    var id = xml.intAttr(n, "val");
                    result.bullet = bullets.filter(function (x) { return x.id == id; })[0];
                    break;
                case "lvlText":
                    result.levelText = xml.stringAttr(n, "val");
                    break;
                case "numFmt":
                    result.format = xml.stringAttr(n, "val");
                    break;
            }
        });
        return result;
    };
    DocumentParser.prototype.parseParagraph = function (node) {
        var _this = this;
        var result = xml_serialize_1.deserializeElement(node, new paragraph_2.Paragraph());
        xml.foreach(node, function (c) {
            switch (c.localName) {
                case "r":
                    result.children.push(_this.parseRun(c));
                    break;
                case "hyperlink":
                    result.children.push(_this.parseHyperlink(c));
                    break;
                case "pPr":
                    _this.parseParagraphProperties(c, result);
                    _this.parseCommonProperties(c, result.props);
                    break;
            }
        });
        return result;
    };
    DocumentParser.prototype.parseParagraphProperties = function (elem, paragraph) {
        var _this = this;
        this.parseDefaultProperties(elem, paragraph.style = {}, null, function (c) {
            if (paragraph_1.parseParagraphProperties(c, paragraph.props))
                return true;
            switch (c.localName) {
                case "pStyle":
                    utils.addElementClass(paragraph, xml.className(c, "val"));
                    break;
                case "cnfStyle":
                    utils.addElementClass(paragraph, values.classNameOfCnfStyle(c));
                    break;
                case "framePr":
                    _this.parseFrame(c, paragraph);
                    break;
                case "rPr":
                    break;
                default:
                    return false;
            }
            return true;
        });
    };
    DocumentParser.prototype.parseFrame = function (node, paragraph) {
        var dropCap = xml.stringAttr(node, "dropCap");
        if (dropCap == "drop")
            paragraph.style["float"] = "left";
    };
    DocumentParser.prototype.parseHyperlink = function (node) {
        var _this = this;
        var result = xml_serialize_1.deserializeElement(node, new hyperlink_1.Hyperlink());
        xml.foreach(node, function (c) {
            switch (c.localName) {
                case "r":
                    result.children.push(_this.parseRun(c));
                    break;
            }
        });
        return result;
    };
    DocumentParser.prototype.parseRun = function (node) {
        var _this = this;
        var result = xml_serialize_1.deserializeElement(node, new run_1.Run());
        xml.foreach(node, function (c) {
            switch (c.localName) {
                case "fldChar":
                    result.fldCharType = xml.stringAttr(c, "fldCharType");
                    break;
                case "lastRenderedPageBreak":
                    var br = new break_1.Break();
                    br.break = "page";
                    result.children.push(br);
                    break;
                case "drawing":
                    var d = _this.parseDrawing(c);
                    if (d)
                        result.children = [d];
                    break;
                case "rPr":
                    _this.parseRunProperties(c, result);
                    break;
            }
        });
        return result;
    };
    DocumentParser.prototype.parseRunProperties = function (elem, run) {
        this.parseDefaultProperties(elem, run.style = {}, null, function (c) {
            switch (c.localName) {
                case "rStyle":
                    run.className = xml.className(c, "val");
                    break;
                case "vertAlign":
                    run.props.verticalAlignment = xml.stringAttr(c, "val");
                    break;
                default:
                    return false;
            }
            return true;
        });
    };
    DocumentParser.prototype.parseDrawing = function (node) {
        for (var _i = 0, _a = xml.elements(node); _i < _a.length; _i++) {
            var n = _a[_i];
            switch (n.localName) {
                case "inline":
                case "anchor":
                    return this.parseDrawingWrapper(n);
            }
        }
    };
    DocumentParser.prototype.parseDrawingWrapper = function (node) {
        var result = new drawing_1.Drawing();
        var isAnchor = node.localName == "anchor";
        var wrapType = null;
        var simplePos = xml.boolAttr(node, "simplePos");
        var posX = { relative: "page", align: "left", offset: "0" };
        var posY = { relative: "page", align: "top", offset: "0" };
        for (var _i = 0, _a = xml.elements(node); _i < _a.length; _i++) {
            var n = _a[_i];
            switch (n.localName) {
                case "simplePos":
                    if (simplePos) {
                        posX.offset = xml.sizeAttr(n, "x", SizeType.Emu);
                        posY.offset = xml.sizeAttr(n, "y", SizeType.Emu);
                    }
                    break;
                case "extent":
                    result.style["width"] = xml.sizeAttr(n, "cx", SizeType.Emu);
                    result.style["height"] = xml.sizeAttr(n, "cy", SizeType.Emu);
                    break;
                case "positionH":
                case "positionV":
                    if (!simplePos) {
                        var pos = n.localName == "positionH" ? posX : posY;
                        var alignNode = xml.byTagName(n, "align");
                        var offsetNode = xml.byTagName(n, "posOffset");
                        if (alignNode)
                            pos.align = alignNode.textContent;
                        if (offsetNode)
                            pos.offset = xml.sizeValue(offsetNode, SizeType.Emu);
                    }
                    break;
                case "wrapTopAndBottom":
                    wrapType = "wrapTopAndBottom";
                    break;
                case "wrapNone":
                    wrapType = "wrapNone";
                    break;
                case "graphic":
                    var g = this.parseGraphic(n);
                    if (g)
                        result.children.push(g);
                    break;
            }
        }
        if (wrapType == "wrapTopAndBottom") {
            result.style['display'] = 'block';
            if (posX.align) {
                result.style['text-align'] = posX.align;
                result.style['width'] = "100%";
            }
        }
        else if (wrapType == "wrapNone") {
            result.style['display'] = 'block';
            result.style['position'] = 'relative';
            result.style["width"] = "0px";
            result.style["height"] = "0px";
            if (posX.offset)
                result.style["left"] = posX.offset;
            if (posY.offset)
                result.style["top"] = posY.offset;
        }
        else if (isAnchor && (posX.align == 'left' || posX.align == 'right')) {
            result.style["float"] = posX.align;
        }
        return result;
    };
    DocumentParser.prototype.parseGraphic = function (elem) {
        var graphicData = xml.byTagName(elem, "graphicData");
        for (var _i = 0, _a = xml.elements(graphicData); _i < _a.length; _i++) {
            var n = _a[_i];
            switch (n.localName) {
                case "pic":
                    return this.parsePicture(n);
            }
        }
        return null;
    };
    DocumentParser.prototype.parsePicture = function (elem) {
        var result = new image_1.Image();
        var blipFill = xml.byTagName(elem, "blipFill");
        var blip = xml.byTagName(blipFill, "blip");
        result.src = xml.stringAttr(blip, "embed");
        var spPr = xml.byTagName(elem, "spPr");
        var xfrm = xml.byTagName(spPr, "xfrm");
        result.style["position"] = "relative";
        for (var _i = 0, _a = xml.elements(xfrm); _i < _a.length; _i++) {
            var n = _a[_i];
            switch (n.localName) {
                case "ext":
                    result.style["width"] = xml.sizeAttr(n, "cx", SizeType.Emu);
                    result.style["height"] = xml.sizeAttr(n, "cy", SizeType.Emu);
                    break;
                case "off":
                    result.style["left"] = xml.sizeAttr(n, "x", SizeType.Emu);
                    result.style["top"] = xml.sizeAttr(n, "y", SizeType.Emu);
                    break;
            }
        }
        return result;
    };
    DocumentParser.prototype.parseTable = function (node) {
        var _this = this;
        var result = new table_1.Table();
        xml.foreach(node, function (c) {
            switch (c.localName) {
                case "tr":
                    result.children.push(_this.parseTableRow(c));
                    break;
                case "tblGrid":
                    result.columns = _this.parseTableColumns(c);
                    break;
                case "tblPr":
                    _this.parseTableProperties(c, result);
                    break;
            }
        });
        return result;
    };
    DocumentParser.prototype.parseTableColumns = function (node) {
        var result = [];
        xml.foreach(node, function (n) {
            switch (n.localName) {
                case "gridCol":
                    result.push({ width: common_2.lengthAttr(n, common_1.ns.wordml, "w") });
                    break;
            }
        });
        return result;
    };
    DocumentParser.prototype.parseTableProperties = function (elem, table) {
        var _this = this;
        table.style = {};
        table.cellStyle = {};
        this.parseDefaultProperties(elem, table.style, table.cellStyle, function (c) {
            switch (c.localName) {
                case "tblStyle":
                    table.className = xml.className(c, "val");
                    break;
                case "tblLook":
                    utils.addElementClass(table, values.classNameOftblLook(c));
                    break;
                case "tblpPr":
                    _this.parseTablePosition(c, table);
                    break;
                default:
                    return false;
            }
            return true;
        });
        switch (table.style["text-align"]) {
            case "center":
                delete table.style["text-align"];
                table.style["margin-left"] = "auto";
                table.style["margin-right"] = "auto";
                break;
            case "right":
                delete table.style["text-align"];
                table.style["margin-left"] = "auto";
                break;
        }
    };
    DocumentParser.prototype.parseTablePosition = function (node, table) {
        var topFromText = xml.sizeAttr(node, "topFromText");
        var bottomFromText = xml.sizeAttr(node, "bottomFromText");
        var rightFromText = xml.sizeAttr(node, "rightFromText");
        var leftFromText = xml.sizeAttr(node, "leftFromText");
        table.style["float"] = 'left';
        table.style["margin-bottom"] = values.addSize(table.style["margin-bottom"], bottomFromText);
        table.style["margin-left"] = values.addSize(table.style["margin-left"], leftFromText);
        table.style["margin-right"] = values.addSize(table.style["margin-right"], rightFromText);
        table.style["margin-top"] = values.addSize(table.style["margin-top"], topFromText);
    };
    DocumentParser.prototype.parseTableRow = function (node) {
        var _this = this;
        var result = new row_1.Row();
        xml.foreach(node, function (c) {
            switch (c.localName) {
                case "tc":
                    result.children.push(_this.parseTableCell(c));
                    break;
                case "trPr":
                    _this.parseTableRowProperties(c, result);
                    break;
            }
        });
        return result;
    };
    DocumentParser.prototype.parseTableRowProperties = function (elem, row) {
        row.style = this.parseDefaultProperties(elem, {}, null, function (c) {
            switch (c.localName) {
                case "cnfStyle":
                    row.className = values.classNameOfCnfStyle(c);
                    break;
                default:
                    return false;
            }
            return true;
        });
    };
    DocumentParser.prototype.parseTableCell = function (node) {
        var _this = this;
        var result = new cell_1.Cell();
        xml.foreach(node, function (c) {
            switch (c.localName) {
                case "tbl":
                    result.children.push(_this.parseTable(c));
                    break;
                case "p":
                    result.children.push(_this.parseParagraph(c));
                    break;
                case "tcPr":
                    _this.parseTableCellProperties(c, result);
                    break;
            }
        });
        return result;
    };
    DocumentParser.prototype.parseTableCellProperties = function (elem, cell) {
        cell.style = this.parseDefaultProperties(elem, {}, null, function (c) {
            switch (c.localName) {
                case "gridSpan":
                    cell.props.gridSpan = xml.intAttr(c, "val", null);
                    break;
                case "vMerge":
                    break;
                case "cnfStyle":
                    cell.className = values.classNameOfCnfStyle(c);
                    break;
                default:
                    return false;
            }
            return true;
        });
    };
    DocumentParser.prototype.parseDefaultProperties = function (elem, style, childStyle, handler) {
        var _this = this;
        if (style === void 0) { style = null; }
        if (childStyle === void 0) { childStyle = null; }
        if (handler === void 0) { handler = null; }
        style = style || {};
        xml.foreach(elem, function (c) {
            switch (c.localName) {
                case "jc":
                    style["text-align"] = values.valueOfJc(c);
                    break;
                case "textAlignment":
                    style["vertical-align"] = values.valueOfTextAlignment(c);
                    break;
                case "color":
                    style["color"] = xml.colorAttr(c, "val", null, exports.autos.color);
                    break;
                case "sz":
                    style["font-size"] = style["min-height"] = xml.sizeAttr(c, "val", SizeType.FontSize);
                    break;
                case "shd":
                    style["background-color"] = xml.colorAttr(c, "fill", null, exports.autos.shd);
                    break;
                case "highlight":
                    style["background-color"] = xml.colorAttr(c, "val", null, exports.autos.highlight);
                    break;
                case "tcW":
                    if (_this.ignoreWidth)
                        break;
                case "tblW":
                    style["width"] = values.valueOfSize(c, "w");
                    break;
                case "trHeight":
                    _this.parseTrHeight(c, style);
                    break;
                case "strike":
                    style["text-decoration"] = values.valueOfStrike(c);
                    break;
                case "b":
                    style["font-weight"] = values.valueOfBold(c);
                    break;
                case "i":
                    style["font-style"] = "italic";
                    break;
                case "u":
                    _this.parseUnderline(c, style);
                    break;
                case "ind":
                case "tblInd":
                    _this.parseIndentation(c, style);
                    break;
                case "rFonts":
                    _this.parseFont(c, style);
                    break;
                case "tblBorders":
                    _this.parseBorderProperties(c, childStyle || style);
                    break;
                case "tblCellSpacing":
                    style["border-spacing"] = values.valueOfMargin(c);
                    style["border-collapse"] = "separate";
                    break;
                case "pBdr":
                    _this.parseBorderProperties(c, style);
                    break;
                case "bdr":
                    style["border"] = values.valueOfBorder(c);
                    break;
                case "tcBorders":
                    _this.parseBorderProperties(c, style);
                    break;
                case "noWrap":
                    break;
                case "tblCellMar":
                case "tcMar":
                    _this.parseMarginProperties(c, childStyle || style);
                    break;
                case "tblLayout":
                    style["table-layout"] = values.valueOfTblLayout(c);
                    break;
                case "vAlign":
                    style["vertical-align"] = xml.stringAttr(c, "val");
                    break;
                case "spacing":
                    if (elem.localName == "pPr")
                        _this.parseSpacing(c, style);
                    break;
                case "lang":
                case "noProof":
                case "webHidden":
                    break;
                default:
                    if (handler != null && !handler(c))
                        _this.debug && console.warn("DOCX: Unknown document element: " + c.localName);
                    break;
            }
        });
        return style;
    };
    DocumentParser.prototype.parseUnderline = function (node, style) {
        var val = xml.stringAttr(node, "val");
        if (val == null || val == "none")
            return;
        switch (val) {
            case "dash":
            case "dashDotDotHeavy":
            case "dashDotHeavy":
            case "dashedHeavy":
            case "dashLong":
            case "dashLongHeavy":
            case "dotDash":
            case "dotDotDash":
                style["text-decoration-style"] = "dashed";
                break;
            case "dotted":
            case "dottedHeavy":
                style["text-decoration-style"] = "dotted";
                break;
            case "double":
                style["text-decoration-style"] = "double";
                break;
            case "single":
            case "thick":
                style["text-decoration"] = "underline";
                break;
            case "wave":
            case "wavyDouble":
            case "wavyHeavy":
                style["text-decoration-style"] = "wavy";
                break;
            case "words":
                style["text-decoration"] = "underline";
                break;
        }
        var col = xml.colorAttr(node, "color");
        if (col)
            style["text-decoration-color"] = col;
    };
    DocumentParser.prototype.parseFont = function (node, style) {
        var ascii = xml.stringAttr(node, "ascii");
        if (ascii)
            style["font-family"] = ascii;
    };
    DocumentParser.prototype.parseIndentation = function (node, style) {
        var firstLine = xml.sizeAttr(node, "firstLine");
        var left = xml.sizeAttr(node, "left");
        var start = xml.sizeAttr(node, "start");
        var right = xml.sizeAttr(node, "right");
        var end = xml.sizeAttr(node, "end");
        if (firstLine)
            style["text-indent"] = firstLine;
        if (left || start)
            style["margin-left"] = left || start;
        if (right || end)
            style["margin-right"] = right || end;
    };
    DocumentParser.prototype.parseSpacing = function (node, style) {
        var before = xml.sizeAttr(node, "before");
        var after = xml.sizeAttr(node, "after");
        var line = xml.intAttr(node, "line", null);
        var lineRule = xml.stringAttr(node, "lineRule");
        if (before)
            style["margin-top"] = before;
        if (after)
            style["margin-bottom"] = after;
        if (line !== null) {
            switch (lineRule) {
                case "auto":
                    style["line-height"] = "" + (line / 240).toFixed(2);
                    break;
                case "atLeast":
                    style["line-height"] = "calc(100% + " + line / 20 + "pt)";
                    break;
                default:
                    style["line-height"] = style["min-height"] = line / 20 + "pt";
                    break;
            }
        }
    };
    DocumentParser.prototype.parseMarginProperties = function (node, output) {
        xml.foreach(node, function (c) {
            switch (c.localName) {
                case "left":
                    output["padding-left"] = values.valueOfMargin(c);
                    break;
                case "right":
                    output["padding-right"] = values.valueOfMargin(c);
                    break;
                case "top":
                    output["padding-top"] = values.valueOfMargin(c);
                    break;
                case "bottom":
                    output["padding-bottom"] = values.valueOfMargin(c);
                    break;
            }
        });
    };
    DocumentParser.prototype.parseTrHeight = function (node, output) {
        switch (xml.stringAttr(node, "hRule")) {
            case "exact":
                output["height"] = xml.sizeAttr(node, "val");
                break;
            case "atLeast":
            default:
                output["height"] = xml.sizeAttr(node, "val");
                break;
        }
    };
    DocumentParser.prototype.parseBorderProperties = function (node, output) {
        xml.foreach(node, function (c) {
            switch (c.localName) {
                case "start":
                case "left":
                    output["border-left"] = values.valueOfBorder(c);
                    break;
                case "end":
                case "right":
                    output["border-right"] = values.valueOfBorder(c);
                    break;
                case "top":
                    output["border-top"] = values.valueOfBorder(c);
                    break;
                case "bottom":
                    output["border-bottom"] = values.valueOfBorder(c);
                    break;
            }
        });
    };
    return DocumentParser;
}());
exports.DocumentParser = DocumentParser;
var SizeType;
(function (SizeType) {
    SizeType[SizeType["FontSize"] = 0] = "FontSize";
    SizeType[SizeType["Dxa"] = 1] = "Dxa";
    SizeType[SizeType["Emu"] = 2] = "Emu";
    SizeType[SizeType["Border"] = 3] = "Border";
    SizeType[SizeType["Percent"] = 4] = "Percent";
})(SizeType || (SizeType = {}));
var xml = (function () {
    function xml() {
    }
    xml.parse = function (xmlString, skipDeclaration) {
        if (skipDeclaration === void 0) { skipDeclaration = true; }
        if (skipDeclaration)
            xmlString = xmlString.replace(/<[?].*[?]>/, "");
        return new DOMParser().parseFromString(xmlString, "application/xml").firstChild;
    };
    xml.elements = function (node, tagName) {
        if (tagName === void 0) { tagName = null; }
        var result = [];
        for (var i = 0; i < node.childNodes.length; i++) {
            var n = node.childNodes[i];
            if (n.nodeType == 1 && (tagName == null || n.localName == tagName))
                result.push(n);
        }
        return result;
    };
    xml.foreach = function (node, cb) {
        for (var i = 0; i < node.childNodes.length; i++) {
            var n = node.childNodes[i];
            if (n.nodeType == 1)
                cb(n);
        }
    };
    xml.byTagName = function (elem, tagName) {
        for (var i = 0; i < elem.childNodes.length; i++) {
            var n = elem.childNodes[i];
            if (n.nodeType == 1 && n.localName == tagName)
                return elem.childNodes[i];
        }
        return null;
    };
    xml.elementStringAttr = function (elem, nodeName, attrName) {
        var n = xml.byTagName(elem, nodeName);
        return n ? xml.stringAttr(n, attrName) : null;
    };
    xml.stringAttr = function (node, attrName) {
        var elem = node;
        for (var i = 0; i < elem.attributes.length; i++) {
            var attr = elem.attributes.item(i);
            if (attr.localName == attrName)
                return attr.value;
        }
        return null;
    };
    xml.colorAttr = function (node, attrName, defValue, autoColor) {
        if (defValue === void 0) { defValue = null; }
        if (autoColor === void 0) { autoColor = 'black'; }
        var v = xml.stringAttr(node, attrName);
        switch (v) {
            case "yellow":
                return v;
            case "auto":
                return autoColor;
        }
        return v ? "#" + v : defValue;
    };
    xml.boolAttr = function (node, attrName, defValue) {
        if (defValue === void 0) { defValue = false; }
        var v = xml.stringAttr(node, attrName);
        switch (v) {
            case "1": return true;
            case "0": return false;
        }
        return defValue;
    };
    xml.intAttr = function (node, attrName, defValue) {
        if (defValue === void 0) { defValue = 0; }
        var val = xml.stringAttr(node, attrName);
        return val ? parseInt(xml.stringAttr(node, attrName)) : defValue;
    };
    xml.sizeAttr = function (node, attrName, type) {
        if (type === void 0) { type = SizeType.Dxa; }
        return xml.convertSize(xml.stringAttr(node, attrName), type);
    };
    xml.sizeValue = function (node, type) {
        if (type === void 0) { type = SizeType.Dxa; }
        return xml.convertSize(node.textContent, type);
    };
    xml.convertSize = function (val, type) {
        if (type === void 0) { type = SizeType.Dxa; }
        if (val == null || val.indexOf("pt") > -1)
            return val;
        var intVal = parseInt(val);
        switch (type) {
            case SizeType.Dxa: return (0.05 * intVal).toFixed(2) + "pt";
            case SizeType.Emu: return (intVal / 12700).toFixed(2) + "pt";
            case SizeType.FontSize: return (0.5 * intVal).toFixed(2) + "pt";
            case SizeType.Border: return (0.125 * intVal).toFixed(2) + "pt";
            case SizeType.Percent: return (0.02 * intVal).toFixed(2) + "%";
        }
        return val;
    };
    xml.className = function (node, attrName) {
        var val = xml.stringAttr(node, attrName);
        return val && val.replace(/[ .]+/g, '-').replace(/[&]+/g, 'and');
    };
    return xml;
}());
var values = (function () {
    function values() {
    }
    values.valueOfBold = function (c) {
        return xml.boolAttr(c, "val", true) ? "bold" : "normal";
    };
    values.valueOfSize = function (c, attr) {
        var type = SizeType.Dxa;
        switch (xml.stringAttr(c, "type")) {
            case "dxa": break;
            case "pct":
                type = SizeType.Percent;
                break;
        }
        return xml.sizeAttr(c, attr, type);
    };
    values.valueOfStrike = function (c) {
        return xml.boolAttr(c, "val", true) ? "line-through" : "none";
    };
    values.valueOfMargin = function (c) {
        return xml.sizeAttr(c, "w");
    };
    values.valueOfRelType = function (c) {
        switch (xml.stringAttr(c, "Type")) {
            case "http://schemas.openxmlformats.org/officeDocument/2006/relationships/settings":
                return dom_1.DomRelationshipType.Settings;
            case "http://schemas.openxmlformats.org/officeDocument/2006/relationships/theme":
                return dom_1.DomRelationshipType.Theme;
            case "http://schemas.microsoft.com/office/2007/relationships/stylesWithEffects":
                return dom_1.DomRelationshipType.StylesWithEffects;
            case "http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles":
                return dom_1.DomRelationshipType.Styles;
            case "http://schemas.openxmlformats.org/officeDocument/2006/relationships/fontTable":
                return dom_1.DomRelationshipType.FontTable;
            case "http://schemas.openxmlformats.org/officeDocument/2006/relationships/image":
                return dom_1.DomRelationshipType.Image;
            case "http://schemas.openxmlformats.org/officeDocument/2006/relationships/webSettings":
                return dom_1.DomRelationshipType.WebSettings;
        }
        return dom_1.DomRelationshipType.Unknown;
    };
    values.valueOfBorder = function (c) {
        var type = xml.stringAttr(c, "val");
        if (type == "nil")
            return "none";
        var color = xml.colorAttr(c, "color");
        var size = xml.sizeAttr(c, "sz", SizeType.Border);
        return size + " solid " + (color == "auto" ? "black" : color);
    };
    values.valueOfTblLayout = function (c) {
        var type = xml.stringAttr(c, "val");
        return type == "fixed" ? "fixed" : "auto";
    };
    values.classNameOfCnfStyle = function (c) {
        var className = "";
        var val = xml.stringAttr(c, "val");
        if (val[0] == "1")
            className += " first-row";
        if (val[1] == "1")
            className += " last-row";
        if (val[2] == "1")
            className += " first-col";
        if (val[3] == "1")
            className += " last-col";
        if (val[4] == "1")
            className += " odd-col";
        if (val[5] == "1")
            className += " even-col";
        if (val[6] == "1")
            className += " odd-row";
        if (val[7] == "1")
            className += " even-row";
        if (val[8] == "1")
            className += " ne-cell";
        if (val[9] == "1")
            className += " nw-cell";
        if (val[10] == "1")
            className += " se-cell";
        if (val[11] == "1")
            className += " sw-cell";
        return className.trim();
    };
    values.valueOfJc = function (c) {
        var type = xml.stringAttr(c, "val");
        switch (type) {
            case "start":
            case "left": return "left";
            case "center": return "center";
            case "end":
            case "right": return "right";
            case "both": return "justify";
        }
        return type;
    };
    values.valueOfTextAlignment = function (c) {
        var type = xml.stringAttr(c, "val");
        switch (type) {
            case "auto":
            case "baseline": return "baseline";
            case "top": return "top";
            case "center": return "middle";
            case "bottom": return "bottom";
        }
        return type;
    };
    values.addSize = function (a, b) {
        if (a == null)
            return b;
        if (b == null)
            return a;
        return "calc(" + a + " + " + b + ")";
    };
    values.checkMask = function (num, mask) {
        return (num & mask) == mask;
    };
    values.classNameOftblLook = function (c) {
        var className = "";
        if (xml.boolAttr(c, "firstColumn"))
            className += " first-col";
        if (xml.boolAttr(c, "firstRow"))
            className += " first-row";
        if (xml.boolAttr(c, "lastColumn"))
            className += " lat-col";
        if (xml.boolAttr(c, "lastRow"))
            className += " last-row";
        if (xml.boolAttr(c, "noHBand"))
            className += " no-hband";
        if (xml.boolAttr(c, "noVBand"))
            className += " no-vband";
        return className.trim();
    };
    return values;
}());
