# ASTPUB

ASTPUB is a digital publishing format designed to serve as an alternative for EPUB. An ASTPUB file is typically generated from a source EPUB.

While EPUB strives to give publishers the freedom to design and format their books as they see fit, ASTPUB does the opposite. It's an unavoidable fact then that certain books will not convert well. ASTPUB attempts to strip away as much of the publisher's original formatting, leaving just the underlying content in a _predictable_ structure that any reader application can utilize to display the file's content in strict accordance to their application's user interface.

In addition, while EPUB gives a lot of freedom in structuring the contents of its file, but ASTPUB does not. ASTPUB adheres to a strict internal structure to ensure ease of use for developers of applications that read it, no guesswork involved. Due to this requirement, ASTPUB does not internally store its data in HTML files, but Abstract Syntax Trees (AST) in JSON, which represent the original (albeit modified) HTML. This makes it much easier for scripts and applications to parse and utilize an ASTPUB's file anywhere.

## Structure

ASTPUB, like EPUB, is just a zip file. Here's its internal structure:

```
├── ast
|   ├── 0.json
|   ├── 1.json
|   └── n.json
├── res
|   ├── 0.jpg
|   ├── 1.gif
|   ├── n.png
|   └── cover.ext
└── meta.json
```

Files are named sequentially, from a zero-based index that's incremented as each file is discovered within the EPUB's source content. `ast/` and `res/` files use separate indexes.

- `ast/` contains the AST content for each section/chapter.
- `res/` contains media files, primarily images.
- `meta.json` describes the file. Check the [Pub](https://github.com/MrXyfir/illuminsight/blob/master/types/illuminsight.d.ts) interface for its schema.
- `res/cover.ext` is the file's cover image, where `ext` is the actual file extension.
