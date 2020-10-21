"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deserializeSchema = exports.deserializeElement = exports.buildXmlSchema = exports.fromAttribute = exports.fromText = exports.children = exports.element = void 0;
var schemaSymbol = Symbol("open-xml-schema");
function element(name) {
    return function (target) {
        var schema = getPrototypeXmlSchema(target.prototype);
        schema.elemName = name;
    };
}
exports.element = element;
function children() {
    var elements = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        elements[_i] = arguments[_i];
    }
    return function (target) {
        var schema = getPrototypeXmlSchema(target.prototype);
        schema.children = {};
        for (var _i = 0, elements_1 = elements; _i < elements_1.length; _i++) {
            var c = elements_1[_i];
            var cs = getPrototypeXmlSchema(c.prototype);
            schema.children[cs.elemName] = { proto: c.prototype, schema: cs };
        }
    };
}
exports.children = children;
function fromText(convert) {
    if (convert === void 0) { convert = null; }
    return function (target, prop) {
        var schema = getPrototypeXmlSchema(target);
        schema.text = { prop: prop, convert: convert };
    };
}
exports.fromText = fromText;
function fromAttribute(attrName, convert) {
    if (convert === void 0) { convert = null; }
    return function (target, prop) {
        var schema = getPrototypeXmlSchema(target);
        schema.attrs[attrName] = { prop: prop, convert: convert };
    };
}
exports.fromAttribute = fromAttribute;
function buildXmlSchema(schemaObj) {
    var schema = {
        text: null,
        attrs: {},
        elemName: null,
        children: null
    };
    for (var p in schemaObj) {
        var v = schemaObj[p];
        if (p == "$elem") {
            schema.elemName = v;
        }
        else if (v.$attr) {
            schema.attrs[v.$attr] = { prop: p, convert: null };
        }
    }
    return schema;
}
exports.buildXmlSchema = buildXmlSchema;
function deserializeElement(n, output) {
    var proto = Object.getPrototypeOf(output);
    var schema = proto[schemaSymbol];
    if (schema == null)
        return output;
    deserializeSchema(n, output, schema);
    for (var i = 0, l = n.children.length; i < l; i++) {
        var elem = n.children.item(i);
        var child = schema.children[elem.localName];
        if (child) {
            var obj = Object.create(child.proto);
            deserializeElement(elem, obj);
            output.children.push(obj);
        }
    }
    return output;
}
exports.deserializeElement = deserializeElement;
function deserializeSchema(n, output, schema) {
    if (schema.text) {
        var prop = schema.text;
        output[prop.prop] = prop.convert ? prop.convert(n.textContent) : n.textContent;
    }
    for (var i = 0, l = n.attributes.length; i < l; i++) {
        var attr = n.attributes.item(i);
        var prop = schema.attrs[attr.localName];
        if (prop == null)
            continue;
        output[prop.prop] = prop.convert ? prop.convert(attr.value) : attr.value;
    }
    return output;
}
exports.deserializeSchema = deserializeSchema;
function getPrototypeXmlSchema(proto) {
    return proto[schemaSymbol] || (proto[schemaSymbol] = {
        text: null,
        attrs: {},
        children: {}
    });
}
