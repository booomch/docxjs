const schemaSymbol = Symbol("open-xml-schema");

export type Converter = (val: string) => any;

export function element(name: string) {
    return function (target: any) {
        var schema = getPrototypeXmlSchema(target.prototype);
        schema.elemName = name;
    }
}

export function children(...elements: any[]) {
    return function (target) {
        var schema = getPrototypeXmlSchema(target.prototype);
        schema.children = {};
        for (let c of elements) {
            let cs = getPrototypeXmlSchema(c.prototype);
            schema.children[cs.elemName] = { proto: c.prototype, schema: cs };
        }
    }
}

export function fromText(convert: Converter = null) {
    return function (target: any, prop: string) {
        var schema = getPrototypeXmlSchema(target);
        schema.text = { prop, convert };
    }
}

export function fromAttribute(attrName: string, convert: Converter = null) {
    return function (target: any, prop: string) {
        var schema = getPrototypeXmlSchema(target);
        schema.attrs[attrName] = { prop, convert };
    }
}

export function buildXmlSchema(schemaObj: any): OpenXmlSchema {
    var schema: OpenXmlSchema = {
        text: null,
        attrs: {},
        elemName: null,
        children: null
    };

    for (let p in schemaObj) {
        let v = schemaObj[p];

        if (p == "$elem") {
            schema.elemName = v;
        }
        else if (v.$attr) {
            schema.attrs[v.$attr] = { prop: p, convert: null };
        }
    }

    return schema;
}

export function deserializeElement(n: Element, output: any) {
    var proto = Object.getPrototypeOf(output);
    var schema = proto[schemaSymbol];

    if (schema == null)
        return output;

    deserializeSchema(n, output, schema);

    for (let i = 0, l = n.children.length; i < l; i++) {
        let elem = n.children.item(i);
        let child = schema.children[elem.localName];

        if (child) {
            let obj = Object.create(child.proto);
            deserializeElement(elem, obj);
            output.children.push(obj);
        }
    }

    return output;
}

export function deserializeSchema(n: Element, output: any, schema: OpenXmlSchema) {
    if (schema.text) {
        let prop = schema.text;
        output[prop.prop] = prop.convert ? prop.convert(n.textContent) : n.textContent;
    }

    for (let i = 0, l = n.attributes.length; i < l; i++) {
        let attr = n.attributes.item(i);
        let prop = schema.attrs[attr.localName];

        if (prop == null)
            continue;

        output[prop.prop] = prop.convert ? prop.convert(attr.value) : attr.value;
    }

    return output;
}

export function deserializeSchemaFromChildren(n: Element, output: any, schema: OpenXmlSchema) {
    if (schema.text) {
        let prop = schema.text;
        output[prop.prop] = prop.convert ? prop.convert(n.textContent) : n.textContent;
    }

    for (let i = 0, l = n.children.length; i < l; i++) {
        let attr = n.children.item(i);
        let prop = schema.attrs[attr.localName];

        if (prop == null)
            continue;

        output[prop.prop] = attr.attributes[0].value;
    }

    return output;
}

export interface OpenXmlSchema {
    elemName: string;
    text: OpenXmlSchemaProperty;
    attrs: Record<string, OpenXmlSchemaProperty>;
    children: Record<string, any>;
}

export interface OpenXmlSchemaProperty {
    prop: string;
    convert: Converter;
}

function getPrototypeXmlSchema(proto: any): OpenXmlSchema {
    return proto[schemaSymbol] || (proto[schemaSymbol] = {
        text: null,
        attrs: {},
        children: {}
    });
}