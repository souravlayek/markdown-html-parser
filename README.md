# Markdown to HTML Converter

[![npm version](https://badge.fury.io/js/markdown-parser-html.svg)](https://badge.fury.io/js/markdown-parser-html)

A simple and efficient npm package that converts Markdown content into HTML.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [API](#api)
- [Examples](#examples)
- [Contributing](#contributing)
- [License](#license)

## Installation

To install this package, run:

```bash
npm install markdown-parser-html
```

## Usage

### Basic Usage

```javascript
import { parseMarkdownToHTML } from 'markdown-parser-html';

const markdown = `# Hello World
This is a **Markdown** document.`;

const html = parseMarkdownToHTML(markdown);

console.log(html);
```

### Get a Dom Tree

You can also use this package from the command line:

```javascript
import { getDomTreeFromMarkdown } from 'markdown-parser-html';

const markdown = `# Hello World
This is a **Markdown** document.`;

const html = getDomTreeFromMarkdown(markdown);

console.log(html);
```

## API

### `parseMarkdownToHTML(markdown)`

Converts the given Markdown string to HTML.

#### Parameters

- `markdown` (string): The Markdown content to convert.

#### Returns

- (string): The resulting HTML string.

### `getDomTreeFromMarkdown(markdown)`

Converts the given Markdown string to List of Element.

#### Parameters

- `markdown` (string): The Markdown content to convert.

#### Returns

- (DOMTree): The resulting List of Nodes.
- Formatted like 
```typescript
{
  tag: string; // div, p, TEXT<for text only>
  tagType: "OPEN" | "CLOSE" | "SELF_CLOSE" | "TEXT"; // OPEN, CLOSE, TEXT
  attributes: Record<string, string>;
  content: string | null; // For Text Node only
  children: DOMTree[] // List of same nodes
}
```

## Contributing

We welcome contributions! Please read our [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines on how to contribute to this project.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
