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
exports.renderStyleValues = exports.ContainerBase = exports.ElementBase = void 0;
var utils_1 = require("../utils");
var ElementBase = (function () {
    function ElementBase() {
    }
    ElementBase.prototype.render = function (ctx) {
        return null;
    };
    return ElementBase;
}());
exports.ElementBase = ElementBase;
var ContainerBase = (function (_super) {
    __extends(ContainerBase, _super);
    function ContainerBase() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.children = [];
        return _this;
    }
    ContainerBase.prototype.renderContainer = function (ctx, tagName) {
        var elem = ctx.html.createElement(tagName);
        renderStyleValues(this.style, elem);
        if (this.className) {
            var classes = this.className.split(" ").map(function (c) { return ctx.className + "_" + c; });
            elem.className = utils_1.appendClass(elem.className, classes.join(" "));
        }
        else {
            elem.className = utils_1.appendClass(elem.className, ctx.className);
        }
        for (var _i = 0, _a = this.children.map(function (c) { return c.render(ctx); }).filter(function (x) { return x != null; }); _i < _a.length; _i++) {
            var n = _a[_i];
            elem.appendChild(n);
        }
        return elem;
    };
    return ContainerBase;
}(ElementBase));
exports.ContainerBase = ContainerBase;
function renderStyleValues(style, ouput) {
    if (style == null)
        return;
    for (var key in style) {
        if (style.hasOwnProperty(key)) {
            ouput.style[key] = style[key];
        }
    }
}
exports.renderStyleValues = renderStyleValues;
