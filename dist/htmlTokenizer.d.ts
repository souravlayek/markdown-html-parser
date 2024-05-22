export type Token = {
    tag: string;
    tagType: "OPEN" | "CLOSE" | "SELF_CLOSE" | "TEXT";
    attributes: Record<string, string>;
    content: string | null;
};
export type DOMTree = Token & {
    children: DOMTree[];
};
declare class HTMLTokenizer {
    private html;
    private currentPosition;
    private currentChar;
    private dom;
    private blocks;
    private tokens;
    constructor(html: string);
    private consume;
    private removeEscapes;
    private shiftPosition;
    private isTagSelfClosing;
    private createTokenForSelfClosingTag;
    private isOpenTag;
    private extractNameAndAttributes;
    private constructTree;
    private getTokenType;
    private getBlocks;
    private constructTokenList;
    private parse;
    getDomTree(): DOMTree[];
}
export default HTMLTokenizer;
