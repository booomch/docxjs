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
exports.Break = void 0;
var element_base_1 = require("./element-base");
var xml_serialize_1 = require("../parser/xml-serialize");
var Break = (function (_super) {
    __extends(Break, _super);
    function Break() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.break = "textWrapping";
        return _this;
    }
    Break.prototype.render = function (ctx) {
        return this.break == "textWrapping" ? ctx.html.createElement("br") : null;
    };
    __decorate([
        xml_serialize_1.fromAttribute("type"),
        __metadata("design:type", String)
    ], Break.prototype, "break", void 0);
    return Break;
}(element_base_1.ElementBase));
exports.Break = Break;
