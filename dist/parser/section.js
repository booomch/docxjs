"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseSectionProperties = void 0;
var common_1 = require("../dom/common");
var xml = require("./common");
function parseSectionProperties(elem) {
    var section = {};
    for (var _i = 0, _a = xml.elements(elem, common_1.ns.wordml); _i < _a.length; _i++) {
        var e = _a[_i];
        switch (e.localName) {
            case "pgSz":
                section.pageSize = {
                    width: xml.lengthAttr(e, common_1.ns.wordml, "w"),
                    height: xml.lengthAttr(e, common_1.ns.wordml, "h"),
                    orientation: xml.stringAttr(e, common_1.ns.wordml, "orient")
                };
                break;
            case "pgMar":
                section.pageMargins = {
                    left: xml.lengthAttr(e, common_1.ns.wordml, "left"),
                    right: xml.lengthAttr(e, common_1.ns.wordml, "right"),
                    top: xml.lengthAttr(e, common_1.ns.wordml, "top"),
                    bottom: xml.lengthAttr(e, common_1.ns.wordml, "bottom"),
                    header: xml.lengthAttr(e, common_1.ns.wordml, "header"),
                    footer: xml.lengthAttr(e, common_1.ns.wordml, "footer"),
                    gutter: xml.lengthAttr(e, common_1.ns.wordml, "gutter"),
                };
                break;
            case "cols":
                section.columns = parseColumns(e);
                break;
        }
    }
    return section;
}
exports.parseSectionProperties = parseSectionProperties;
function parseColumns(elem) {
    return {
        numberOfColumns: xml.intAttr(elem, common_1.ns.wordml, "num"),
        space: xml.lengthAttr(elem, common_1.ns.wordml, "space"),
        separator: xml.boolAttr(elem, common_1.ns.wordml, "sep"),
        equalWidth: xml.boolAttr(elem, common_1.ns.wordml, "equalWidth", true),
        columns: xml.elements(elem, common_1.ns.wordml, "col")
            .map(function (e) { return ({
            width: xml.lengthAttr(e, common_1.ns.wordml, "w"),
            space: xml.lengthAttr(e, common_1.ns.wordml, "space")
        }); })
    };
}
