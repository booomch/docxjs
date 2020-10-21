"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseParagraphProperties = void 0;
var xml = require("./common");
var common_1 = require("../dom/common");
var section_1 = require("./section");
var common_2 = require("./common");
var xml_serialize_1 = require("./xml-serialize");
function parseParagraphProperties(elem, props) {
    if (elem.namespaceURI != common_1.ns.wordml)
        return false;
    switch (elem.localName) {
        case "tabs":
            props.tabs = parseTabs(elem);
            break;
        case "sectPr":
            props.sectionProps = section_1.parseSectionProperties(elem);
            break;
        case "numPr":
            props.numbering = xml_serialize_1.deserializeSchema(elem, {}, numberingSchema);
            break;
        case "spacing":
            props.lineSpacing = xml_serialize_1.deserializeSchema(elem, {}, lineSpacingSchema);
            return false;
            break;
        default:
            return false;
    }
    return true;
}
exports.parseParagraphProperties = parseParagraphProperties;
function parseTabs(elem) {
    return xml.elements(elem, common_1.ns.wordml, "tab")
        .map(function (e) { return ({
        position: xml.lengthAttr(e, common_1.ns.wordml, "pos"),
        leader: xml.stringAttr(e, common_1.ns.wordml, "leader"),
        style: xml.stringAttr(e, common_1.ns.wordml, "val")
    }); });
}
var numberingSchema = xml_serialize_1.buildXmlSchema({
    $elem: "numPr",
    id: { $attr: "numId" },
    level: { $attr: "ilvl", convert: function (v) { return parseInt(v); } },
});
var lineSpacingSchema = xml_serialize_1.buildXmlSchema({
    $elem: "spacing",
    before: { $attr: "before", convert: function (v) { return common_2.convertLength(v); } },
    after: { $attr: "after", convert: function (v) { return common_2.convertLength(v); } },
    line: { $attr: "line", convert: function (v) { return parseInt(v); } },
    lineRule: { $attr: "before" },
});
