"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HtmlRenderer = void 0;
var break_1 = require("./elements/break");
var paragraph_1 = require("./elements/paragraph");
var table_1 = require("./elements/table");
var render_context_1 = require("./dom/render-context");
var HtmlRenderer = (function () {
    function HtmlRenderer(htmlDocument) {
        this.htmlDocument = htmlDocument;
        this.inWrapper = true;
        this.className = "docx";
        this._renderContext = new render_context_1.RenderContext();
        this._renderContext.html = htmlDocument;
    }
    HtmlRenderer.prototype.render = function (document, bodyContainer, styleContainer, options) {
        if (styleContainer === void 0) { styleContainer = null; }
        this.document = document;
        this.options = options;
        this._renderContext.options = options;
        this._renderContext.className = this.className;
        this._renderContext.document = document;
        styleContainer = styleContainer || bodyContainer;
        removeAllElements(styleContainer);
        removeAllElements(bodyContainer);
        appendComment(styleContainer, "docxjs library predefined styles");
        styleContainer.appendChild(this.renderDefaultStyle());
        appendComment(styleContainer, "docx document styles");
        styleContainer.appendChild(this.renderStyles(document.styles));
        if (document.numbering) {
            appendComment(styleContainer, "docx document numbering styles");
            styleContainer.appendChild(this.renderNumbering(document.numbering, styleContainer));
        }
        if (!options.ignoreFonts)
            this.renderFontTable(document.fontTable, styleContainer);
        var sectionElements = this.renderSections(document.document);
        if (this.inWrapper) {
            var wrapper = this.renderWrapper();
            appentElements(wrapper, sectionElements);
            bodyContainer.appendChild(wrapper);
        }
        else {
            appentElements(bodyContainer, sectionElements);
        }
    };
    HtmlRenderer.prototype.renderFontTable = function (fonts, styleContainer) {
        var _loop_1 = function (f) {
            this_1.document.loadFont(f.refId, f.fontKey).then(function (fontData) {
                var cssTest = "@font-face {\n                    font-family: \"" + f.name + "\";\n                    src: url(" + fontData + ");\n                }";
                appendComment(styleContainer, "Font " + f.name);
                styleContainer.appendChild(createStyleElement(cssTest));
            });
        };
        var this_1 = this;
        for (var _i = 0, _a = fonts.filter(function (x) { return x.refId; }); _i < _a.length; _i++) {
            var f = _a[_i];
            _loop_1(f);
        }
    };
    HtmlRenderer.prototype.processClassName = function (className) {
        if (!className)
            return this.className;
        return this.className + "_" + className;
    };
    HtmlRenderer.prototype.processStyles = function (styles) {
        var stylesMap = {};
        for (var _i = 0, _a = styles.filter(function (x) { return x.id != null; }); _i < _a.length; _i++) {
            var style = _a[_i];
            stylesMap[style.id] = style;
        }
        for (var _b = 0, _c = styles.filter(function (x) { return x.basedOn; }); _b < _c.length; _b++) {
            var style = _c[_b];
            var baseStyle = stylesMap[style.basedOn];
            if (baseStyle) {
                var _loop_2 = function (styleValues) {
                    baseValues = baseStyle.styles.filter(function (x) { return x.target == styleValues.target; });
                    if (baseValues && baseValues.length > 0)
                        this_2.copyStyleProperties(baseValues[0].values, styleValues.values);
                };
                var this_2 = this, baseValues;
                for (var _d = 0, _e = style.styles; _d < _e.length; _d++) {
                    var styleValues = _e[_d];
                    _loop_2(styleValues);
                }
            }
            else if (this.options.debug)
                console.warn("Can't find base style " + style.basedOn);
        }
        for (var _f = 0, styles_1 = styles; _f < styles_1.length; _f++) {
            var style = styles_1[_f];
            style.id = this.processClassName(style.id);
        }
        return stylesMap;
    };
    HtmlRenderer.prototype.processElement = function (element) {
        if (element.children) {
            for (var _i = 0, _a = element.children; _i < _a.length; _i++) {
                var e = _a[_i];
                e.parent = element;
                if (e instanceof table_1.Table) {
                    this.processTable(e);
                }
                else {
                    this.processElement(e);
                }
            }
        }
    };
    HtmlRenderer.prototype.processTable = function (table) {
        for (var _i = 0, _a = table.children; _i < _a.length; _i++) {
            var r = _a[_i];
            for (var _b = 0, _c = r.children; _b < _c.length; _b++) {
                var c = _c[_b];
                c.style = this.copyStyleProperties(table.cellStyle, c.style, [
                    "border-left", "border-right", "border-top", "border-bottom",
                    "padding-left", "padding-right", "padding-top", "padding-bottom"
                ]);
                this.processElement(c);
            }
        }
    };
    HtmlRenderer.prototype.copyStyleProperties = function (input, output, attrs) {
        if (attrs === void 0) { attrs = null; }
        if (!input)
            return output;
        if (output == null)
            output = {};
        if (attrs == null)
            attrs = Object.getOwnPropertyNames(input);
        for (var _i = 0, attrs_1 = attrs; _i < attrs_1.length; _i++) {
            var key = attrs_1[_i];
            if (input.hasOwnProperty(key) && !output.hasOwnProperty(key))
                output[key] = input[key];
        }
        return output;
    };
    HtmlRenderer.prototype.createSection = function (className, props) {
        var elem = this.htmlDocument.createElement("section");
        elem.className = className;
        if (props) {
            if (props.pageMargins) {
                elem.style.paddingLeft = this.renderLength(props.pageMargins.left);
                elem.style.paddingRight = this.renderLength(props.pageMargins.right);
                elem.style.paddingTop = this.renderLength(props.pageMargins.top);
                elem.style.paddingBottom = this.renderLength(props.pageMargins.bottom);
            }
            if (props.pageSize) {
                if (!this.options.ignoreWidth)
                    elem.style.width = this.renderLength(props.pageSize.width);
                if (!this.options.ignoreHeight)
                    elem.style.minHeight = this.renderLength(props.pageSize.height);
            }
            if (props.columns && props.columns.numberOfColumns) {
                elem.style.columnCount = "" + props.columns.numberOfColumns;
                elem.style.columnGap = this.renderLength(props.columns.space);
                if (props.columns.separator) {
                    elem.style.columnRule = "1px solid black";
                }
            }
        }
        return elem;
    };
    HtmlRenderer.prototype.renderSections = function (document) {
        var result = [];
        this.processElement(document);
        for (var _i = 0, _a = this.splitBySection(document.children); _i < _a.length; _i++) {
            var section = _a[_i];
            var sectionElement = this.createSection(this.className, section.sectProps || document.props);
            this.renderElements(section.elements, sectionElement);
            result.push(sectionElement);
        }
        return result;
    };
    HtmlRenderer.prototype.splitBySection = function (elements) {
        var current = { sectProps: null, elements: [] };
        var result = [current];
        function splitElement(elem, revert) {
            var children = elem.children;
            var newElem = Object.create(Object.getPrototypeOf(elem));
            Object.assign(newElem, elem);
            var _a = revert ? [elem, newElem] : [newElem, elem], f = _a[0], s = _a[1];
            f.children = children.slice(pBreakIndex);
            s.children = children.slice(0, rBreakIndex);
            return newElem;
        }
        for (var _i = 0, elements_1 = elements; _i < elements_1.length; _i++) {
            var elem = elements_1[_i];
            current.elements.push(elem);
            if (elem instanceof paragraph_1.Paragraph) {
                var sectProps = elem.props.sectionProps;
                var pBreakIndex = -1;
                var rBreakIndex = -1;
                if (this.options.breakPages && elem.children) {
                    pBreakIndex = elem.children.findIndex(function (r) {
                        var _a, _b;
                        rBreakIndex = (_b = (_a = r.children) === null || _a === void 0 ? void 0 : _a.findIndex(function (t) { return (t instanceof break_1.Break) && t.break == "page"; })) !== null && _b !== void 0 ? _b : -1;
                        return rBreakIndex != -1;
                    });
                }
                if (sectProps || pBreakIndex != -1) {
                    current.sectProps = sectProps;
                    current = { sectProps: null, elements: [] };
                    result.push(current);
                }
                if (pBreakIndex != -1) {
                    var breakRun = elem.children[pBreakIndex];
                    var splitRun = rBreakIndex < breakRun.children.length - 1;
                    if (pBreakIndex < elem.children.length - 1 || splitRun) {
                        current.elements.push(splitElement(elem, false));
                        if (splitRun) {
                            elem.children.push(splitElement(breakRun, true));
                        }
                    }
                }
            }
        }
        return result;
    };
    HtmlRenderer.prototype.renderLength = function (l) {
        return !l ? null : "" + l.value + l.type;
    };
    HtmlRenderer.prototype.renderWrapper = function () {
        var wrapper = document.createElement("div");
        wrapper.className = this.className + "-wrapper";
        return wrapper;
    };
    HtmlRenderer.prototype.renderDefaultStyle = function () {
        var styleText = "." + this.className + "-wrapper { background: gray; padding: 30px; padding-bottom: 0px; display: flex; flex-flow: column; align-items: center; } \n                ." + this.className + "-wrapper section." + this.className + " { background: white; box-shadow: 0 0 10px rgba(0, 0, 0, 0.5); margin-bottom: 30px; }\n                ." + this.className + " { color: black; }\n                section." + this.className + " { box-sizing: border-box; }\n                ." + this.className + " table { border-collapse: collapse; }\n                ." + this.className + " table td, ." + this.className + " table th { vertical-align: top; }\n                ." + this.className + " p { margin: 0pt; }";
        return createStyleElement(styleText);
    };
    HtmlRenderer.prototype.renderNumbering = function (styles, styleContainer) {
        var _this = this;
        var styleText = "";
        var rootCounters = [];
        var _loop_3 = function () {
            selector = "p." + this_3.numberingClass(num.id, num.level);
            listStyleType = "none";
            if (num.levelText && num.format == "decimal") {
                var counter = this_3.numberingCounter(num.id, num.level);
                if (num.level > 0) {
                    styleText += this_3.styleToString("p." + this_3.numberingClass(num.id, num.level - 1), {
                        "counter-reset": counter
                    });
                }
                else {
                    rootCounters.push(counter);
                }
                styleText += this_3.styleToString(selector + ":before", {
                    "content": this_3.levelTextToContent(num.levelText, num.id),
                    "counter-increment": counter
                });
                styleText += this_3.styleToString(selector, __assign({ "display": "list-item", "list-style-position": "inside", "list-style-type": "none" }, num.style));
            }
            else if (num.bullet) {
                var valiable_1 = ("--" + this_3.className + "-" + num.bullet.src).toLowerCase();
                styleText += this_3.styleToString(selector + ":before", {
                    "content": "' '",
                    "display": "inline-block",
                    "background": "var(" + valiable_1 + ")"
                }, num.bullet.style);
                this_3.document.loadNumberingImage(num.bullet.src).then(function (data) {
                    var text = "." + _this.className + "-wrapper { " + valiable_1 + ": url(" + data + ") }";
                    styleContainer.appendChild(createStyleElement(text));
                });
            }
            else {
                listStyleType = this_3.numFormatToCssValue(num.format);
            }
            styleText += this_3.styleToString(selector, __assign({ "display": "list-item", "list-style-position": "inside", "list-style-type": listStyleType }, num.style));
        };
        var this_3 = this, selector, listStyleType;
        for (var _i = 0, styles_2 = styles; _i < styles_2.length; _i++) {
            var num = styles_2[_i];
            _loop_3();
        }
        if (rootCounters.length > 0) {
            styleText += this.styleToString("." + this.className + "-wrapper", {
                "counter-reset": rootCounters.join(" ")
            });
        }
        return createStyleElement(styleText);
    };
    HtmlRenderer.prototype.renderStyles = function (styles) {
        var styleText = "";
        var stylesMap = this.processStyles(styles);
        for (var _i = 0, styles_3 = styles; _i < styles_3.length; _i++) {
            var style = styles_3[_i];
            var subStyles = style.styles;
            if (style.linked) {
                var linkedStyle = style.linked && stylesMap[style.linked];
                if (linkedStyle)
                    subStyles = subStyles.concat(linkedStyle.styles);
                else if (this.options.debug)
                    console.warn("Can't find linked style " + style.linked);
            }
            for (var _a = 0, subStyles_1 = subStyles; _a < subStyles_1.length; _a++) {
                var subStyle = subStyles_1[_a];
                var selector = "";
                if (style.target == subStyle.target)
                    selector += style.target + "." + style.id;
                else if (style.target)
                    selector += style.target + "." + style.id + " " + subStyle.target;
                else
                    selector += "." + style.id + " " + subStyle.target;
                if (style.isDefault && style.target)
                    selector = "." + this.className + " " + style.target + ", " + selector;
                styleText += this.styleToString(selector, subStyle.values);
            }
        }
        return createStyleElement(styleText);
    };
    HtmlRenderer.prototype.renderElements = function (elems, into) {
        var _this = this;
        if (elems == null)
            return null;
        var result = elems.map(function (e) { return e.render(_this._renderContext); }).filter(function (e) { return e != null; });
        if (into)
            for (var _i = 0, result_1 = result; _i < result_1.length; _i++) {
                var c = result_1[_i];
                into.appendChild(c);
            }
        return result;
    };
    HtmlRenderer.prototype.numberingClass = function (id, lvl) {
        return this.className + "-num-" + id + "-" + lvl;
    };
    HtmlRenderer.prototype.styleToString = function (selectors, values, cssText) {
        if (cssText === void 0) { cssText = null; }
        var result = selectors + " {\r\n";
        for (var key in values) {
            result += "  " + key + ": " + values[key] + ";\r\n";
        }
        if (cssText)
            result += ";" + cssText;
        return result + "}\r\n";
    };
    HtmlRenderer.prototype.numberingCounter = function (id, lvl) {
        return this.className + "-num-" + id + "-" + lvl;
    };
    HtmlRenderer.prototype.levelTextToContent = function (text, id) {
        var _this = this;
        var result = text.replace(/%\d*/g, function (s) {
            var lvl = parseInt(s.substring(1), 10) - 1;
            return "\"counter(" + _this.numberingCounter(id, lvl) + ")\"";
        });
        return '"' + result + '"';
    };
    HtmlRenderer.prototype.numFormatToCssValue = function (format) {
        var mapping = {
            "none": "none",
            "bullet": "disc",
            "decimal": "decimal",
            "lowerLetter": "lower-alpha",
            "upperLetter": "upper-alpha",
            "lowerRoman": "lower-roman",
            "upperRoman": "upper-roman",
        };
        return mapping[format] || format;
    };
    return HtmlRenderer;
}());
exports.HtmlRenderer = HtmlRenderer;
function appentElements(container, children) {
    for (var _i = 0, children_1 = children; _i < children_1.length; _i++) {
        var c = children_1[_i];
        container.appendChild(c);
    }
}
function removeAllElements(elem) {
    while (elem.firstChild) {
        elem.removeChild(elem.firstChild);
    }
}
function createStyleElement(cssText) {
    var styleElement = document.createElement("style");
    styleElement.type = "text/css";
    styleElement.innerHTML = cssText;
    return styleElement;
}
function appendComment(elem, comment) {
    elem.appendChild(document.createComment(comment));
}
