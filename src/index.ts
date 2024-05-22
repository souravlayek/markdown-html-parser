class MarkdownParser {
  private markdown: string;
  private codeBlockPlaceholders: string[];

  constructor(markdown: string) {
    this.markdown = markdown;
    this.codeBlockPlaceholders = [];
  }

  parse(): string {
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

  private protectCodeBlocks(markdown: string): string {
    return markdown.replace(
      /```(\w+)?\s*([\s\S]*?)```/g,
      (match, lang, code) => {
        const languageClass = lang ? ` class="language-${lang}"` : "";
        const placeholder = `<!--codeblock${this.codeBlockPlaceholders.length}-->`;
        this.codeBlockPlaceholders.push(
          `<pre><code${languageClass}>${code}</code></pre>`
        );
        return placeholder;
      }
    );
  }

  private restoreCodeBlocks(html: string): string {
    this.codeBlockPlaceholders.forEach((codeBlock, index) => {
      const placeholder = `<!--codeblock${index}-->`;
      html = html.replace(placeholder, codeBlock);
    });
    return html;
  }

  private parseHeadings(markdown: string): string {
    return markdown.replace(/^(#{1,6})\s*(.+)$/gm, (match, hashes, content) => {
      const level = hashes.length;
      return `<h${level}>${content}</h${level}>`;
    });
  }

  private parseBold(markdown: string): string {
    return markdown.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  }

  private parseItalic(markdown: string): string {
    return markdown.replace(/(\*|_)(.+?)\1/g, "<em>$2</em>");
  }

  private parseLinks(markdown: string): string {
    return markdown.replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2">$1</a>');
  }

  private parseImages(markdown: string): string {
    return markdown.replace(/!\[(.*?)\]\((.+?)\)/g, '<img src="$2" alt="$1">');
  }

  private parseInlineCode(markdown: string): string {
    return markdown.replace(/`(.+?)`/g, "<code>$1</code>");
  }

  private parseParagraphs(markdown: string): string {
    return markdown.replace(/^(?!<.*>)(.+)$/gm, "<p>$1</p>");
  }

  private parseBlockquotes(markdown: string): string {
    return markdown.replace(/^>\s*(.+)$/gm, "<blockquote>$1</blockquote>");
  }

  private parseLists(markdown: string): string {
    // Parsing unordered lists
    markdown = markdown.replace(/^(\s*)- (.+)$/gm, (match, spaces, content) => {
      const indentLevel = spaces.length / 2;
      return `<ul>${" ".repeat(indentLevel * 2)}<li>${content}</li></ul>`;
    });

    // Parsing ordered lists
    markdown = markdown.replace(
      /^(\s*)\d+\. (.+)$/gm,
      (match, spaces, content) => {
        const indentLevel = spaces.length / 2;
        return `<ol>${" ".repeat(indentLevel * 2)}<li>${content}</li></ol>`;
      }
    );

    // Remove extra spaces inside nested lists
    markdown = markdown.replace(/<\/(ul|ol)>\s*<\1>/g, "");

    return markdown;
  }
}

export default MarkdownParser

export function parseMarkdownToHTML(markdown: string) {
    const parser = new MarkdownParser(markdown)
    return parser.parse()
}