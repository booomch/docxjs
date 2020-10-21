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
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Hyperlink = void 0;
var element_base_1 = require("./element-base");
var xml_serialize_1 = require("../parser/xml-serialize");
var Hyperlink = (function (_super) {
    __extends(Hyperlink, _super);
    function Hyperlink() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Hyperlink.prototype.render = function (ctx) {
        var a = this.renderContainer(ctx, "a");
        if (this.anchor)
            a.href = "#" + this.anchor;
        return a;
    };
    __decorate([
        xml_serialize_1.fromAttribute("anchor"),
        __metadata("design:type", String)
    ], Hyperlink.prototype, "anchor", void 0);
    Hyperlink = __decorate([
        xml_serialize_1.element("hyperlink")
    ], Hyperlink);
    return Hyperlink;
}(element_base_1.ContainerBase));
exports.Hyperlink = Hyperlink;
