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
exports.Tab = void 0;
var element_base_1 = require("./element-base");
var javascript_1 = require("../javascript");
var paragraph_1 = require("./paragraph");
var xml_serialize_1 = require("../parser/xml-serialize");
var Tab = (function (_super) {
    __extends(Tab, _super);
    function Tab() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Tab.prototype.render = function (ctx) {
        var _this = this;
        var tabSpan = ctx.html.createElement("span");
        tabSpan.innerHTML = "&emsp;";
        if (ctx.options.experimental) {
            setTimeout(function () {
                var paragraph = findParent(_this);
                if (paragraph.props.tabs == null)
                    return;
                paragraph.props.tabs.sort(function (a, b) { return a.position.value - b.position.value; });
                tabSpan.style.display = "inline-block";
                javascript_1.updateTabStop(tabSpan, paragraph.props.tabs);
            }, 0);
        }
        return tabSpan;
    };
    Tab = __decorate([
        xml_serialize_1.element("tab")
    ], Tab);
    return Tab;
}(element_base_1.ElementBase));
exports.Tab = Tab;
function findParent(elem) {
    var parent = elem.parent;
    while (parent != null && !(parent instanceof paragraph_1.Paragraph))
        parent = parent.parent;
    return parent;
}
