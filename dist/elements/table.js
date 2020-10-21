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
exports.Table = void 0;
var element_base_1 = require("./element-base");
var common_1 = require("../dom/common");
var Table = (function (_super) {
    __extends(Table, _super);
    function Table() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Table.prototype.render = function (ctx) {
        var elem = this.renderContainer(ctx, "table");
        if (this.columns)
            elem.appendChild(this.renderTableColumns(ctx, this.columns));
        return elem;
    };
    Table.prototype.renderTableColumns = function (ctx, columns) {
        var result = ctx.html.createElement("colGroup");
        for (var _i = 0, columns_1 = columns; _i < columns_1.length; _i++) {
            var col = columns_1[_i];
            var colElem = ctx.html.createElement("col");
            if (col.width)
                colElem.style.width = common_1.renderLength(col.width);
            result.appendChild(colElem);
        }
        return result;
    };
    return Table;
}(element_base_1.ContainerBase));
exports.Table = Table;
