import { OpenXmlElement } from "../dom/dom";
import { RenderContext } from "../dom/render-context";
import { appendClass } from "../utils";
import { Tab } from "./tab";

export abstract class ElementBase implements OpenXmlElement {
    type: any;
    parent: OpenXmlElement;
    children?: ElementBase[];

    render(ctx: RenderContext): Node {
        return null;
    }
}

export abstract class ContainerBase extends ElementBase {
    children: ElementBase[] = [];
    style: any;
    className: string;

    protected renderContainer<K extends keyof HTMLElementTagNameMap>(ctx: RenderContext, tagName: K): HTMLElementTagNameMap[K] {
        var elem = ctx.html.createElement(tagName);

        renderStyleValues(this.style, elem);

        if (this.className) {
            let classes = this.className.split(" ").map(c => `${ctx.className}_${c}`);
            elem.className = appendClass(elem.className, classes.join(" "));
        }
        else {
            elem.className = appendClass(elem.className, ctx.className);
        }

        for (let i = 0; i < this.children.length; i++) {
            let floatRight = false
            const el = this.children[i];
            if (el.children && el.children.length > 1) {
                if (el.children.length == 2 &&
                    el.children[0].constructor.name == "Tab" &&
                    el.children[1].constructor.name == "Text") {
                    floatRight = true
                    el.children.shift()
                }
            }
            let rend = el.render(ctx)
            if (rend != null) {
                if (floatRight) {
                    rend["style"]["float"] = 'right';
                }
                elem.appendChild(rend);
            }
        }


        return elem;
    }
}

///deprecated
export function renderStyleValues(style: any, ouput: HTMLElement) {
    if (style == null)
        return;

    for (let key in style) {
        if (style.hasOwnProperty(key)) {
            ouput.style[key] = style[key];
        }
    }
}