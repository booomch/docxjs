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
exports.Cell = void 0;
var element_base_1 = require("./element-base");
var Cell = (function (_super) {
    __extends(Cell, _super);
    function Cell() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.props = {};
        return _this;
    }
    Cell.prototype.render = function (ctx) {
        var elem = this.renderContainer(ctx, "td");
        if (this.props.gridSpan)
            elem.colSpan = this.props.gridSpan;
        return elem;
    };
    return Cell;
}(element_base_1.ContainerBase));
exports.Cell = Cell;
