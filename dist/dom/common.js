"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderLength = exports.ns = void 0;
exports.ns = {
    wordml: "http://schemas.openxmlformats.org/wordprocessingml/2006/main"
};
function renderLength(l) {
    return !l ? null : "" + l.value + l.type;
}
exports.renderLength = renderLength;
