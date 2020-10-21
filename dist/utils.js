"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.appendClass = exports.addElementClass = void 0;
function addElementClass(element, className) {
    return element.className = appendClass(element.className, className);
}
exports.addElementClass = addElementClass;
function appendClass(classList, className) {
    return (!classList) ? className : classList + " " + className;
}
exports.appendClass = appendClass;
