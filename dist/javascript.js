"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateTabStop = void 0;
function updateTabStop(elem, tabs, pixelToPoint) {
    if (pixelToPoint === void 0) { pixelToPoint = 72 / 96; }
    var p = elem.closest("p");
    var tbb = elem.getBoundingClientRect();
    var pbb = p.getBoundingClientRect();
    var left = (tbb.left - pbb.left) * pixelToPoint;
    var tab = tabs.find(function (t) { return t.style != "clear" && t.position.value > left; });
    if (tab == null)
        return;
    elem.style.display = "inline-block";
    elem.style.width = (tab.position.value - left) + "pt";
    switch (tab.leader) {
        case "dot":
        case "middleDot":
            elem.style.borderBottom = "1px black dotted";
            break;
        case "hyphen":
        case "heavy":
        case "underscore":
            elem.style.borderBottom = "1px black solid";
            break;
    }
}
exports.updateTabStop = updateTabStop;
