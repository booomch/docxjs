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
exports.Symbol = exports.Text = void 0;
var element_base_1 = require("./element-base");
var xml_serialize_1 = require("../parser/xml-serialize");
var Text = (function (_super) {
    __extends(Text, _super);
    function Text() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Text.prototype.render = function (context) {
        return context.html.createTextNode(this.text);
    };
    __decorate([
        xml_serialize_1.fromText(),
        __metadata("design:type", String)
    ], Text.prototype, "text", void 0);
    Text = __decorate([
        xml_serialize_1.element("t")
    ], Text);
    return Text;
}(element_base_1.ElementBase));
exports.Text = Text;
var Symbol = (function (_super) {
    __extends(Symbol, _super);
    function Symbol() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Symbol.prototype.render = function (ctx) {
        var span = ctx.html.createElement("span");
        span.style.fontFamily = this.font;
        span.innerHTML = "&#x" + this.char + ";";
        return span;
    };
    return Symbol;
}(element_base_1.ElementBase));
exports.Symbol = Symbol;
