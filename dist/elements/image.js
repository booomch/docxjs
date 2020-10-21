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
exports.Image = void 0;
var element_base_1 = require("./element-base");
var Image = (function (_super) {
    __extends(Image, _super);
    function Image() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.style = {};
        return _this;
    }
    Image.prototype.render = function (ctx) {
        var result = ctx.html.createElement("img");
        element_base_1.renderStyleValues(this.style, result);
        if (ctx.document) {
            ctx.document.loadDocumentImage(this.src).then(function (x) {
                result.src = x;
            });
        }
        return result;
    };
    return Image;
}(element_base_1.ElementBase));
exports.Image = Image;
