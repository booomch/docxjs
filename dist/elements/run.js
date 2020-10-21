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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Run = void 0;
var element_base_1 = require("./element-base");
var xml_serialize_1 = require("../parser/xml-serialize");
var break_1 = require("./break");
var text_1 = require("./text");
var tab_1 = require("./tab");
var Run = (function (_super) {
    __extends(Run, _super);
    function Run() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.props = {};
        return _this;
    }
    Run.prototype.render = function (ctx) {
        if (this.fldCharType)
            return null;
        var elem = this.renderContainer(ctx, "span");
        var wrapper = null;
        switch (this.props.verticalAlignment) {
            case "subscript":
                wrapper = ctx.html.createElement("sub");
                break;
            case "superscript":
                wrapper = ctx.html.createElement("sup");
                break;
        }
        if (wrapper == null)
            return elem;
        wrapper.appendChild(elem);
        return wrapper;
    };
    Run = __decorate([
        xml_serialize_1.element("r"),
        xml_serialize_1.children(text_1.Text, break_1.Break, text_1.Symbol, tab_1.Tab)
    ], Run);
    return Run;
}(element_base_1.ContainerBase));
exports.Run = Run;
