"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseBorders = exports.parseBorder = exports.lengthAttr = exports.convertLength = exports.LengthUsage = exports.boolAttr = exports.colorAttr = exports.intAttr = exports.stringAttr = exports.elements = void 0;
var common_1 = require("../dom/common");
function elements(elem, namespaceURI, localName) {
    if (namespaceURI === void 0) { namespaceURI = null; }
    if (localName === void 0) { localName = null; }
    var result = [];
    for (var i = 0; i < elem.childNodes.length; i++) {
        var n = elem.childNodes[i];
        if (n.nodeType == 1
            && (namespaceURI == null || n.namespaceURI == namespaceURI)
            && (localName == null || n.localName == localName))
            result.push(n);
    }
    return result;
}
exports.elements = elements;
function stringAttr(elem, namespaceURI, name) {
    return elem.getAttributeNS(namespaceURI, name);
}
exports.stringAttr = stringAttr;
function intAttr(elem, namespaceURI, name) {
    var val = elem.getAttributeNS(namespaceURI, name);
    return val ? parseInt(val) : null;
}
exports.intAttr = intAttr;
function colorAttr(elem, namespaceURI, name) {
    var val = elem.getAttributeNS(namespaceURI, name);
    return val ? "#" + val : null;
}
exports.colorAttr = colorAttr;
function boolAttr(elem, namespaceURI, name, defaultValue) {
    if (defaultValue === void 0) { defaultValue = false; }
    var val = elem.getAttributeNS(namespaceURI, name);
    if (val == null)
        return defaultValue;
    return val === "true" || val === "1";
}
exports.boolAttr = boolAttr;
exports.LengthUsage = {
    Dxa: { mul: 0.05, unit: "pt" },
    Emu: { mul: 1 / 12700, unit: "pt" },
    FontSize: { mul: 0.5, unit: "pt" },
    Border: { mul: 0.125, unit: "pt" },
    Percent: { mul: 0.02, unit: "%" },
    LineHeight: { mul: 1 / 240, unit: null }
};
function convertLength(val, usage) {
    if (usage === void 0) { usage = exports.LengthUsage.Dxa; }
    return val ? { value: parseInt(val) * usage.mul, type: usage.unit } : null;
}
exports.convertLength = convertLength;
function lengthAttr(elem, namespaceURI, name, usage) {
    if (usage === void 0) { usage = exports.LengthUsage.Dxa; }
    return convertLength(elem.getAttributeNS(namespaceURI, name), usage);
}
exports.lengthAttr = lengthAttr;
function parseBorder(elem) {
    return {
        type: stringAttr(elem, common_1.ns.wordml, "val"),
        color: colorAttr(elem, common_1.ns.wordml, "color"),
        size: lengthAttr(elem, common_1.ns.wordml, "sz", exports.LengthUsage.Border)
    };
}
exports.parseBorder = parseBorder;
function parseBorders(elem) {
    var result = {};
    for (var _i = 0, _a = elements(elem, common_1.ns.wordml); _i < _a.length; _i++) {
        var e = _a[_i];
        switch (e.localName) {
            case "left":
                result.left = parseBorder(e);
                break;
            case "top":
                result.top = parseBorder(e);
                break;
            case "right":
                result.right = parseBorder(e);
                break;
            case "botton":
                result.botton = parseBorder(e);
                break;
        }
    }
    return result;
}
exports.parseBorders = parseBorders;
