"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDomTreeFromMarkdown = exports.parseMarkdownToHTML = void 0;
const htmlTokenizer_1 = __importDefault(require("./htmlTokenizer"));
__exportStar(require("./htmlTokenizer"), exports);
class MarkdownParser {
    constructor(markdown) {
        this.markdown = markdown;
        this.codeBlockPlaceholders = [];
    }
    parse() {
        // First pass: protect code blocks
        let html = this.protectCodeBlocks(this.markdown);
        // Parse other elements
        html = this.parseHeadings(html);
        html = this.parseBlockquotes(html);
        html = this.parseLists(html);
        html = this.parseBold(html);
        html = this.parseItalic(html);
        html = this.parseImages(html);
        html = this.parseLinks(html);
        html = this.parseInlineCode(html);
        html = this.parseParagraphs(html);
        // Second pass: restore code blocks
        html = this.restoreCodeBlocks(html);
        return html;
    }
    protectCodeBlocks(markdown) {
        return markdown.replace(/```(\w+)?\s*([\s\S]*?)```/g, (match, lang, code) => {
            const languageClass = lang ? ` class="language-${lang}"` : "";
            const placeholder = `<!--codeblock${this.codeBlockPlaceholders.length}-->`;
            this.codeBlockPlaceholders.push(`<pre><code${languageClass}>${code}</code></pre>`);
            return placeholder;
        });
    }
    restoreCodeBlocks(html) {
        this.codeBlockPlaceholders.forEach((codeBlock, index) => {
            const placeholder = `<!--codeblock${index}-->`;
            html = html.replace(placeholder, codeBlock);
        });
        return html;
    }
    parseHeadings(markdown) {
        return markdown.replace(/^(#{1,6})\s*(.+)$/gm, (match, hashes, content) => {
            const level = hashes.length;
            return `<h${level}>${content}</h${level}>`;
        });
    }
    parseBold(markdown) {
        return markdown.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
    }
    parseItalic(markdown) {
        return markdown.replace(/(\*|_)(.+?)\1/g, "<em>$2</em>");
    }
    parseLinks(markdown) {
        return markdown.replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2">$1</a>');
    }
    parseImages(markdown) {
        return markdown.replace(/!\[(.*?)\]\((.+?)\)/g, '<img src="$2" alt="$1"/>');
    }
    parseInlineCode(markdown) {
        return markdown.replace(/`(.+?)`/g, "<i>$1</i>");
    }
    parseParagraphs(markdown) {
        return markdown.replace(/^(?!<.*>)(.+)$/gm, "<p>$1</p>");
    }
    parseBlockquotes(markdown) {
        return markdown.replace(/^>\s*(.+)$/gm, "<blockquote>$1</blockquote>");
    }
    parseLists(markdown) {
        // Parsing unordered lists
        markdown = markdown.replace(/^(\s*)- (.+)$/gm, (match, spaces, content) => {
            const indentLevel = spaces.length / 2;
            return `<ul>${" ".repeat(indentLevel * 2)}<li>${content}</li></ul>`;
        });
        // Parsing ordered lists
        markdown = markdown.replace(/^(\s*)\d+\. (.+)$/gm, (match, spaces, content) => {
            const indentLevel = spaces.length / 2;
            return `<ol>${" ".repeat(indentLevel * 2)}<li>${content}</li></ol>`;
        });
        // Remove extra spaces inside nested lists
        markdown = markdown.replace(/<\/(ul|ol)>\s*<\1>/g, "");
        return markdown;
    }
}
exports.default = MarkdownParser;
function parseMarkdownToHTML(markdown) {
    const parser = new MarkdownParser(markdown);
    return parser.parse();
}
exports.parseMarkdownToHTML = parseMarkdownToHTML;
function getDomTreeFromMarkdown(markdown) {
    const html = parseMarkdownToHTML(markdown);
    const tokenizer = new htmlTokenizer_1.default(html);
    return tokenizer.getDomTree();
}
exports.getDomTreeFromMarkdown = getDomTreeFromMarkdown;
