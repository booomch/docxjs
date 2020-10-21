"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.ElementStyleWriter = exports.TextStyleWriter = exports.StyleWriterBase = exports.RenderContext = void 0;
var RenderContext = (function () {
    function RenderContext() {
    }
    RenderContext.prototype.numberingClass = function (id, lvl) {
        return this.className + "-num-" + id + "-" + lvl;
    };
    return RenderContext;
}());
exports.RenderContext = RenderContext;
var StyleWriterBase = (function () {
    function StyleWriterBase() {
    }
    return StyleWriterBase;
}());
exports.StyleWriterBase = StyleWriterBase;
var TextStyleWriter = (function (_super) {
    __extends(TextStyleWriter, _super);
    function TextStyleWriter(text) {
        if (text === void 0) { text = ""; }
        var _this = _super.call(this) || this;
        _this.text = text;
        return _this;
    }
    TextStyleWriter.prototype.write = function (prop, value) {
        this.text += prop + ": " + value + ";";
        return this;
    };
    return TextStyleWriter;
}(StyleWriterBase));
exports.TextStyleWriter = TextStyleWriter;
var ElementStyleWriter = (function (_super) {
    __extends(ElementStyleWriter, _super);
    function ElementStyleWriter(element) {
        var _this = _super.call(this) || this;
        _this.element = element;
        return _this;
    }
    ElementStyleWriter.prototype.write = function (prop, value) {
        this.element.style[prop] = value;
        return this;
    };
    return ElementStyleWriter;
}(StyleWriterBase));
exports.ElementStyleWriter = ElementStyleWriter;
