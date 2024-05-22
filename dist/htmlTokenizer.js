"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const TOKEN_TYPE = {
    ELEMENT: "ELEMENT",
    TEXT: "TEXT",
};
class HTMLTokenizer {
    //   private currentText: string
    constructor(html) {
        this.html = html;
        this.currentPosition = 0;
        this.currentChar = html[0];
        this.blocks = [];
        this.tokens = [];
        this.dom = [];
    }
    consume() {
        this.currentPosition++;
        this.currentChar =
            this.currentPosition < this.html.length
                ? this.html[this.currentPosition]
                : null;
    }
    removeEscapes(content) {
        let escapeCharPattern = /[\n\t\r]/g;
        return content.replace(escapeCharPattern, "").trim();
    }
    shiftPosition(index) {
        this.currentPosition = index;
        this.currentChar = this.html[index];
    }
    isTagSelfClosing(tag) {
        return tag.includes("/>");
    }
    createTokenForSelfClosingTag(codeBlock) {
        const regex = /<(\w+)(.*?)\/?>/g;
        const match = regex.exec(codeBlock);
        if (!match) {
            return null;
        }
        const result = {
            tag: match === null || match === void 0 ? void 0 : match[1],
            tagType: "SELF_CLOSE",
            attributes: {},
            content: null,
        };
        const attributeRegex = /(\w+)\s*=\s*["']([^"']*)["']/g;
        let attributeMatch;
        while ((attributeMatch = attributeRegex.exec(match[2])) !== null) {
            result.attributes[attributeMatch[1]] = attributeMatch[2];
        }
        this.shiftPosition(this.currentPosition + codeBlock.length);
        return result;
    }
    isOpenTag(tag) {
        const regex = /<(\w+)[^>]*>/g;
        return !!tag.match(regex);
    }
    extractNameAndAttributes(element) {
        const regex = /<(\w+)[^>]*>/g;
        const match = regex.exec(element);
        const tagName = match === null || match === void 0 ? void 0 : match[1];
        const attrRegex = /(\w+)\s*=\s*['"]([^'"]*)['"]/g;
        let attrMatch;
        let attributes = {};
        while ((attrMatch = attrRegex.exec(element)) !== null) {
            attributes[attrMatch[1]] = attrMatch[2];
        }
        return {
            name: tagName,
            attributes,
        };
    }
    constructTree(tokens) {
        let index = 0;
        let skipCounter = 0;
        const dom = [];
        while (index < tokens.length) {
            const currentElement = tokens[index];
            if (currentElement.tagType === "TEXT" ||
                currentElement.tagType === "SELF_CLOSE") {
                dom.push(Object.assign(Object.assign({}, currentElement), { children: [] }));
                index++;
                continue;
            }
            if (currentElement.tagType === "OPEN") {
                index++;
                let children = [];
                while (index < tokens.length) {
                    let childElement = tokens[index];
                    if (childElement.tagType === "OPEN") {
                        if (childElement.tag === currentElement.tag)
                            skipCounter++;
                        children.push(childElement);
                        index++;
                        continue;
                    }
                    else if (childElement.tagType === "CLOSE") {
                        if (childElement.tag === currentElement.tag) {
                            if (skipCounter > 0) {
                                skipCounter--;
                                children.push(childElement);
                                index++;
                                continue;
                            }
                            else {
                                break;
                            }
                        }
                    }
                    children.push(childElement);
                    index++;
                }
                const childTokens = this.constructTree(children);
                dom.push(Object.assign(Object.assign({}, currentElement), { children: childTokens }));
            }
            index++;
        }
        return dom;
    }
    // --------------------- --------------------------------
    getTokenType(item) {
        if (item.match(/<[^>]+>/g)) {
            return TOKEN_TYPE.ELEMENT;
        }
        return TOKEN_TYPE.TEXT;
    }
    getBlocks() {
        let list = [];
        while (this.html.length - 1 >= this.currentPosition) {
            if (this.currentChar === "<") {
                let text = "";
                while (this.html.length >= this.currentPosition) {
                    text += this.currentChar;
                    // @ts-ignore
                    if (this.currentChar === ">") {
                        list.push(text);
                        text = "";
                        this.consume();
                        break;
                    }
                    this.consume();
                }
            }
            else {
                let text = "";
                while (this.html.length >= this.currentPosition) {
                    // @ts-ignore
                    if (this.currentChar === "<") {
                        list.push(text);
                        text = "";
                        break;
                    }
                    text += this.currentChar;
                    this.consume();
                }
            }
        }
        this.blocks = list;
    }
    constructTokenList() {
        const tokenList = [];
        for (let index = 0; index < this.blocks.length; index++) {
            const element = this.blocks[index];
            if (this.getTokenType(element) === TOKEN_TYPE.ELEMENT) {
                if (this.isOpenTag(element)) {
                    const { name, attributes } = this.extractNameAndAttributes(element);
                    tokenList.push({
                        tag: name,
                        tagType: "OPEN",
                        attributes,
                        content: null,
                    });
                    continue;
                }
                if (this.isTagSelfClosing(element)) {
                    const result = this.createTokenForSelfClosingTag(element);
                    if (result) {
                        tokenList.push(Object.assign({}, result));
                    }
                    continue;
                }
                tokenList.push({
                    tag: element.replace(/<\/(\w+)>/g, "$1"),
                    tagType: "CLOSE",
                    attributes: {},
                    content: null,
                });
            }
            else {
                tokenList.push({
                    tag: "TEXT",
                    tagType: "TEXT",
                    attributes: {},
                    content: element,
                });
            }
        }
        this.tokens = tokenList;
    }
    parse() {
        this.getBlocks();
        this.constructTokenList();
        this.dom = this.constructTree(this.tokens);
    }
    getDomTree() {
        this.parse();
        return this.dom;
    }
}
exports.default = HTMLTokenizer;
