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
exports.Paragraph = void 0;
var element_base_1 = require("./element-base");
var utils_1 = require("../utils");
var xml_serialize_1 = require("../parser/xml-serialize");
var bookmark_1 = require("./bookmark");
var Paragraph = (function (_super) {
    __extends(Paragraph, _super);
    function Paragraph() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.props = {};
        return _this;
    }
    Paragraph.prototype.render = function (ctx) {
        var elem = this.renderContainer(ctx, "p");
        if (this.props.numbering) {
            var numberingClass = ctx.numberingClass(this.props.numbering.id, this.props.numbering.level);
            elem.className = utils_1.appendClass(elem.className, numberingClass);
        }
        return elem;
    };
    Paragraph = __decorate([
        xml_serialize_1.element("p"),
        xml_serialize_1.children(bookmark_1.BookmarkStart, bookmark_1.BookmarkEnd)
    ], Paragraph);
    return Paragraph;
}(element_base_1.ContainerBase));
exports.Paragraph = Paragraph;
