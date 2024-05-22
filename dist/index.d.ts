export * from "./htmlTokenizer";
declare class MarkdownParser {
    private markdown;
    private codeBlockPlaceholders;
    constructor(markdown: string);
    parse(): string;
    private protectCodeBlocks;
    private restoreCodeBlocks;
    private parseHeadings;
    private parseBold;
    private parseItalic;
    private parseLinks;
    private parseImages;
    private parseInlineCode;
    private parseParagraphs;
    private parseBlockquotes;
    private parseLists;
}
export default MarkdownParser;
export declare function parseMarkdownToHTML(markdown: string): string;
export declare function getDomTreeFromMarkdown(markdown: string): import("./htmlTokenizer").DOMTree[];
