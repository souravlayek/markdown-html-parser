export type Token = {
  tag: string; // div, p, TEXT<for text only>
  tagType: "OPEN" | "CLOSE" | "SELF_CLOSE" | "TEXT"; // OPEN, CLOSE, TEXT
  attributes: Record<string, string>;
  content: string | null; // For Text Node only
};

const TOKEN_TYPE = {
  ELEMENT: "ELEMENT",
  TEXT: "TEXT",
};

export type DOMTree = Token & {
  children: DOMTree[];
};

type TokenType = (typeof TOKEN_TYPE)[keyof typeof TOKEN_TYPE];

class HTMLTokenizer {
  private html: string;
  private currentPosition: number;
  private currentChar: string | null;
  private dom: DOMTree[];
  private blocks: string[];
  private tokens: Token[];
  //   private currentText: string

  constructor(html: string) {
    this.html = html;
    this.currentPosition = 0;
    this.currentChar = html[0];
    this.blocks = [];
    this.tokens = [];
    this.dom = [];
  }
  private consume() {
    this.currentPosition++;
    this.currentChar =
      this.currentPosition < this.html.length
        ? this.html[this.currentPosition]
        : null;
  }
  private removeEscapes(content: string): string {
    let escapeCharPattern = /[\n\t\r]/g;
    return content.replace(escapeCharPattern, "").trim();
  }
  private shiftPosition(index: number) {
    this.currentPosition = index;
    this.currentChar = this.html[index];
  }

  private isTagSelfClosing(tag: string): boolean {
    return tag.includes("/>");
  }

  private createTokenForSelfClosingTag(codeBlock: string): Token | null {
    const regex = /<(\w+)(.*?)\/?>/g;
    const match = regex.exec(codeBlock);
    if (!match) {
      return null;
    }

    const result: Token = {
      tag: match?.[1],
      tagType: "SELF_CLOSE",
      attributes: {},
      content: null,
    };

    const attributeRegex = /(\w+)\s*=\s*["']([^"']*)["']/g;
    let attributeMatch: any;
    while ((attributeMatch = attributeRegex.exec(match[2])) !== null) {
      result.attributes[attributeMatch[1]]= attributeMatch[2]
    }
    this.shiftPosition(this.currentPosition + codeBlock.length);
    return result;
  }

  private isOpenTag(tag: string): boolean {
    const regex = /<(\w+)[^>]*>/g;
    return !!tag.match(regex);
  }
  private extractNameAndAttributes(element: string): {
    name: string;
    attributes: Record<string, string>;
  } {
    const regex = /<(\w+)[^>]*>/g;
    const match = regex.exec(element);
    const tagName = match?.[1];
    const attrRegex = /(\w+)\s*=\s*['"]([^'"]*)['"]/g;
    let attrMatch;
    let attributes: Record<string, string> = {};
    while ((attrMatch = attrRegex.exec(element)) !== null) {
      attributes[attrMatch[1]] = attrMatch[2]
    }
    return {
      name: tagName!,
      attributes,
    };
  }
  private constructTree(tokens: Token[]) {
    let index = 0;
    let skipCounter = 0;
    const dom: any[] = [];
    while (index < tokens.length) {
      const currentElement = tokens[index];
      if (
        currentElement.tagType === "TEXT" ||
        currentElement.tagType === "SELF_CLOSE"
      ) {
        dom.push({ ...currentElement, children: [] });
        index++;
        continue;
      }
      if (currentElement.tagType === "OPEN") {
        index++;
        let children: any[] = [];
        while (index < tokens.length) {
          let childElement = tokens[index];
          if (childElement.tagType === "OPEN") {
            if (childElement.tag === currentElement.tag) skipCounter++;
            children.push(childElement);
            index++;
            continue;
          } else if (childElement.tagType === "CLOSE") {
            if (childElement.tag === currentElement.tag) {
              if (skipCounter > 0) {
                skipCounter--;
                children.push(childElement);
                index++;
                continue;
              } else {
                break;
              }
            }
          }
          children.push(childElement);
          index++;
        }
        const childTokens = this.constructTree(children);
        dom.push({ ...currentElement, children: childTokens });
      }
      index++;
    }
    return dom;
  }

  // --------------------- --------------------------------
  private getTokenType(item: string): TokenType {
    if (item.match(/<[^>]+>/g)) {
      return TOKEN_TYPE.ELEMENT;
    }
    return TOKEN_TYPE.TEXT;
  }
  private getBlocks() {
    let list: any[] = [];
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
      } else {
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

  private constructTokenList() {
    const tokenList: Token[] = [];
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
            tokenList.push({
              ...result,
            });
          }
          continue;
        }
        tokenList.push({
          tag: element.replace(/<\/(\w+)>/g, "$1"),
          tagType: "CLOSE",
          attributes: {},
          content: null,
        });
      } else {
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
  private parse() {
    this.getBlocks();
    this.constructTokenList();
    this.dom = this.constructTree(this.tokens);
  }
  getDomTree() {
    this.parse();
    return this.dom;
  }
}

export default HTMLTokenizer