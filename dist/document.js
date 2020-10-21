"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deobfuscate = exports.Document = void 0;
var JSZip = require("jszip");
var PartType;
(function (PartType) {
    PartType["Document"] = "word/document.xml";
    PartType["Style"] = "word/styles.xml";
    PartType["Numbering"] = "word/numbering.xml";
    PartType["FontTable"] = "word/fontTable.xml";
    PartType["DocumentRelations"] = "word/_rels/document.xml.rels";
    PartType["NumberingRelations"] = "word/_rels/numbering.xml.rels";
    PartType["FontRelations"] = "word/_rels/fontTable.xml.rels";
})(PartType || (PartType = {}));
var Document = (function () {
    function Document() {
        this.zip = new JSZip();
        this.docRelations = null;
        this.fontRelations = null;
        this.numRelations = null;
        this.styles = null;
        this.fonts = null;
        this.numbering = null;
        this.document = null;
    }
    Document.load = function (blob, parser) {
        var d = new Document();
        return d.zip.loadAsync(blob).then(function (z) {
            var files = [
                d.loadPart(PartType.DocumentRelations, parser),
                d.loadPart(PartType.FontRelations, parser),
                d.loadPart(PartType.NumberingRelations, parser),
                d.loadPart(PartType.Style, parser),
                d.loadPart(PartType.FontTable, parser),
                d.loadPart(PartType.Numbering, parser),
                d.loadPart(PartType.Document, parser)
            ];
            return Promise.all(files.filter(function (x) { return x != null; })).then(function (x) { return d; });
        });
    };
    Document.prototype.loadDocumentImage = function (id) {
        return this.loadResource(this.docRelations, id, "blob")
            .then(function (x) { return x ? URL.createObjectURL(x) : null; });
    };
    Document.prototype.loadNumberingImage = function (id) {
        return this.loadResource(this.numRelations, id, "blob")
            .then(function (x) { return x ? URL.createObjectURL(x) : null; });
    };
    Document.prototype.loadFont = function (id, key) {
        return this.loadResource(this.fontRelations, id, "uint8array")
            .then(function (x) { return x ? URL.createObjectURL(new Blob([deobfuscate(x, key)])) : x; });
    };
    Document.prototype.loadResource = function (relations, id, outputType) {
        if (outputType === void 0) { outputType = "base64"; }
        var rel = relations.find(function (x) { return x.id == id; });
        return rel ? this.zip.files["word/" + rel.target].async(outputType) : Promise.resolve(null);
    };
    Document.prototype.loadPart = function (part, parser) {
        var _this = this;
        var f = this.zip.files[part];
        return f ? f.async("text").then(function (xml) {
            switch (part) {
                case PartType.FontRelations:
                    _this.fontRelations = parser.parseDocumentRelationsFile(xml);
                    break;
                case PartType.DocumentRelations:
                    _this.docRelations = parser.parseDocumentRelationsFile(xml);
                    break;
                case PartType.NumberingRelations:
                    _this.numRelations = parser.parseDocumentRelationsFile(xml);
                    break;
                case PartType.Style:
                    _this.styles = parser.parseStylesFile(xml);
                    break;
                case PartType.Numbering:
                    _this.numbering = parser.parseNumberingFile(xml);
                    break;
                case PartType.Document:
                    _this.document = parser.parseDocumentFile(xml);
                    break;
                case PartType.FontTable:
                    _this.fontTable = parser.parseFontTable(xml);
                    break;
            }
            return _this;
        }) : null;
    };
    return Document;
}());
exports.Document = Document;
function deobfuscate(data, guidKey) {
    var len = 16;
    var trimmed = guidKey.replace(/{|}|-/g, "");
    var numbers = new Array(len);
    for (var i = 0; i < len; i++)
        numbers[len - i - 1] = parseInt(trimmed.substr(i * 2, 2), 16);
    for (var i = 0; i < 32; i++)
        data[i] = data[i] ^ numbers[i % len];
    return data;
}
exports.deobfuscate = deobfuscate;
